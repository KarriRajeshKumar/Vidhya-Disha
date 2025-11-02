-- Create user profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name text,
  email text,
  avatar_url text,
  bio text,
  current_role text,
  experience_level text DEFAULT 'beginner',
  skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  total_points integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create career paths table
CREATE TABLE public.career_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  difficulty text DEFAULT 'intermediate',
  duration text,
  skills_required text[] DEFAULT '{}',
  total_steps integer DEFAULT 0,
  icon text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create user career progress table
CREATE TABLE public.user_career_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  career_path_id uuid REFERENCES public.career_paths(id) ON DELETE CASCADE NOT NULL,
  current_step integer DEFAULT 0,
  completed_steps integer DEFAULT 0,
  progress_percentage integer DEFAULT 0,
  started_at timestamp with time zone DEFAULT now(),
  last_activity timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, career_path_id)
);

-- Create teams table
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  max_members integer DEFAULT 10,
  current_members integer DEFAULT 0,
  team_type text DEFAULT 'study_group',
  skills_focus text[] DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create team members table
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member',
  joined_at timestamp with time zone DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- Create team join requests table
CREATE TABLE public.team_join_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending',
  message text,
  requested_at timestamp with time zone DEFAULT now(),
  responded_at timestamp with time zone,
  UNIQUE(team_id, user_id)
);

-- Create achievements table
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  icon text,
  points integer DEFAULT 0,
  category text,
  requirements jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id uuid REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create exams table
CREATE TABLE public.exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text,
  difficulty text DEFAULT 'intermediate',
  duration_minutes integer DEFAULT 60,
  total_questions integer DEFAULT 20,
  passing_score integer DEFAULT 70,
  exam_type text DEFAULT 'practice',
  created_at timestamp with time zone DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_type text DEFAULT 'workshop',
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  location text,
  max_participants integer,
  current_participants integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_career_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for career paths (public read)
CREATE POLICY "Anyone can view career paths" ON public.career_paths FOR SELECT USING (true);

-- Create RLS policies for user career progress
CREATE POLICY "Users can view own progress" ON public.user_career_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_career_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_career_progress FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for teams
CREATE POLICY "Anyone can view teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create teams" ON public.teams FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Team creators can update teams" ON public.teams FOR UPDATE USING (auth.uid() = created_by);

-- Create RLS policies for team members
CREATE POLICY "Anyone can view team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Team members can join" ON public.team_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Team members can leave" ON public.team_members FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for team join requests
CREATE POLICY "Users can view requests for their teams or own requests" ON public.team_join_requests 
FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND created_by = auth.uid())
);
CREATE POLICY "Users can create join requests" ON public.team_join_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Team owners can update requests" ON public.team_join_requests 
FOR UPDATE USING (EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND created_by = auth.uid()));

-- Create RLS policies for achievements
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- Create RLS policies for user achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can earn achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for exams
CREATE POLICY "Anyone can view exams" ON public.exams FOR SELECT USING (true);

-- Create RLS policies for events
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample career paths
INSERT INTO public.career_paths (title, description, difficulty, duration, skills_required, total_steps, icon) VALUES
('Web Development', 'Master modern web development with React, Node.js, and databases', 'beginner', '6 months', '{"JavaScript", "React", "Node.js", "HTML", "CSS"}', 12, 'Code'),
('Data Science', 'Learn data analysis, machine learning, and statistical modeling', 'intermediate', '8 months', '{"Python", "Statistics", "Machine Learning", "SQL"}', 15, 'BarChart'),
('DevOps Engineering', 'Master cloud infrastructure, CI/CD, and containerization', 'advanced', '10 months', '{"Docker", "Kubernetes", "AWS", "Linux", "CI/CD"}', 18, 'Cloud'),
('Mobile Development', 'Build native and cross-platform mobile applications', 'intermediate', '7 months', '{"React Native", "Flutter", "iOS", "Android"}', 14, 'Smartphone'),
('UI/UX Design', 'Create beautiful and user-friendly digital experiences', 'beginner', '5 months', '{"Figma", "Adobe XD", "User Research", "Prototyping"}', 10, 'Palette');

-- Insert sample achievements
INSERT INTO public.achievements (title, description, icon, points, category, requirements) VALUES
('First Steps', 'Complete your first learning module', 'Trophy', 50, 'learning', '{"modules_completed": 1}'),
('Team Player', 'Join your first team', 'Users', 100, 'collaboration', '{"teams_joined": 1}'),
('Streak Master', 'Maintain a 7-day learning streak', 'Flame', 200, 'consistency', '{"streak_days": 7}'),
('Knowledge Seeker', 'Complete 5 exams with passing scores', 'BookOpen', 300, 'assessment', '{"exams_passed": 5}'),
('Mentor', 'Help 3 team members complete their goals', 'Award', 500, 'leadership', '{"members_helped": 3}');

-- Insert sample exams
INSERT INTO public.exams (title, description, subject, difficulty, duration_minutes, total_questions, passing_score, exam_type) VALUES
('JavaScript Fundamentals', 'Test your knowledge of core JavaScript concepts', 'JavaScript', 'beginner', 45, 15, 70, 'practice'),
('React Components', 'Advanced React component patterns and state management', 'React', 'intermediate', 60, 20, 75, 'certification'),
('Database Design', 'SQL queries, normalization, and optimization', 'Database', 'intermediate', 90, 25, 80, 'practice'),
('Python Data Structures', 'Lists, dictionaries, sets, and algorithms', 'Python', 'beginner', 30, 12, 65, 'quiz'),
('Cloud Architecture', 'AWS services, scaling, and best practices', 'Cloud', 'advanced', 120, 30, 85, 'certification');