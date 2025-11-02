-- Fix RLS policies for team_join_requests to ensure they work properly

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view requests for their teams or own requests" ON public.team_join_requests;
DROP POLICY IF EXISTS "Users can create join requests" ON public.team_join_requests;
DROP POLICY IF EXISTS "Team owners can update requests" ON public.team_join_requests;

-- Create improved RLS policies for team join requests

-- Allow users to view their own requests OR requests for teams they own
CREATE POLICY "Users can view own requests or requests for owned teams" ON public.team_join_requests 
FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE teams.id = team_join_requests.team_id 
    AND teams.created_by = auth.uid()
  )
);

-- Allow authenticated users to create join requests for themselves
CREATE POLICY "Authenticated users can create join requests" ON public.team_join_requests 
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND 
  auth.uid() = user_id
);

-- Allow team owners to update requests for their teams
CREATE POLICY "Team owners can update requests for their teams" ON public.team_join_requests 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE teams.id = team_join_requests.team_id 
    AND teams.created_by = auth.uid()
  )
);

-- Allow users to delete their own requests OR team owners to delete requests for their teams
CREATE POLICY "Users can delete own requests or team owners can delete requests" ON public.team_join_requests 
FOR DELETE USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.teams 
    WHERE teams.id = team_join_requests.team_id 
    AND teams.created_by = auth.uid()
  )
);

-- Ensure the table has RLS enabled
ALTER TABLE public.team_join_requests ENABLE ROW LEVEL SECURITY;