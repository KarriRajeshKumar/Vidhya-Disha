-- Enhance teams table with status field and updated_at
DO $$ 
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'status') THEN
    ALTER TABLE public.teams ADD COLUMN status text DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'FULL', 'CLOSED'));
  END IF;
  
  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teams' AND column_name = 'updated_at') THEN
    ALTER TABLE public.teams ADD COLUMN updated_at timestamp with time zone DEFAULT now();
  END IF;
END $$;

-- Update existing teams to have proper status based on current/max members
UPDATE public.teams 
SET status = CASE 
  WHEN current_members >= max_members THEN 'FULL'
  ELSE 'OPEN'
END
WHERE status IS NULL OR status = '';

-- Create function to automatically update team status when members change
CREATE OR REPLACE FUNCTION public.update_team_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the team's current_members count and status
  UPDATE public.teams 
  SET 
    current_members = (
      SELECT COUNT(*) 
      FROM public.team_members 
      WHERE team_id = COALESCE(NEW.team_id, OLD.team_id)
    ),
    status = CASE 
      WHEN (
        SELECT COUNT(*) 
        FROM public.team_members 
        WHERE team_id = COALESCE(NEW.team_id, OLD.team_id)
      ) >= max_members THEN 'FULL'
      WHEN status = 'CLOSED' THEN 'CLOSED'  -- Keep manually closed status
      ELSE 'OPEN'
    END,
    updated_at = now()
  WHERE id = COALESCE(NEW.team_id, OLD.team_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update team status
DROP TRIGGER IF EXISTS trigger_update_team_status_on_member_insert ON public.team_members;
DROP TRIGGER IF EXISTS trigger_update_team_status_on_member_delete ON public.team_members;

CREATE TRIGGER trigger_update_team_status_on_member_insert
  AFTER INSERT ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_team_status();

CREATE TRIGGER trigger_update_team_status_on_member_delete
  AFTER DELETE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_team_status();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_teams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for teams updated_at
DROP TRIGGER IF EXISTS trigger_teams_updated_at ON public.teams;
CREATE TRIGGER trigger_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_teams_updated_at();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teams_status ON public.teams(status);
CREATE INDEX IF NOT EXISTS idx_teams_updated_at ON public.teams(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_join_requests_status ON public.team_join_requests(status);
CREATE INDEX IF NOT EXISTS idx_team_join_requests_team_id_status ON public.team_join_requests(team_id, status);

-- Update RLS policies to include status field
DROP POLICY IF EXISTS "Anyone can view teams" ON public.teams;
CREATE POLICY "Anyone can view teams" ON public.teams FOR SELECT USING (true);

-- Add policy for team status updates (only team leaders)
CREATE POLICY "Team leaders can update team status" ON public.teams 
FOR UPDATE USING (auth.uid() = created_by);

-- Ensure team leaders are automatically added as members when creating a team
CREATE OR REPLACE FUNCTION public.add_team_leader_as_member()
RETURNS TRIGGER AS $$
BEGIN
  -- Add the team creator as a member with leader role
  INSERT INTO public.team_members (team_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'leader');
  
  -- Update the team's current_members count
  UPDATE public.teams 
  SET current_members = 1
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to add team leader as member
DROP TRIGGER IF EXISTS trigger_add_team_leader_as_member ON public.teams;
CREATE TRIGGER trigger_add_team_leader_as_member
  AFTER INSERT ON public.teams
  FOR EACH ROW
  EXECUTE FUNCTION public.add_team_leader_as_member();