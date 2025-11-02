-- Create table for quiz questions
CREATE TABLE public.quiz_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text text NOT NULL,
  category text NOT NULL CHECK (category IN ('personality', 'skills', 'interests', 'goals')),
  options jsonb NOT NULL,
  question_order integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create table for user quiz results
CREATE TABLE public.user_quiz_results (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  session_id text NOT NULL,
  answers jsonb NOT NULL,
  profile_analysis jsonb NOT NULL,
  career_recommendations jsonb NOT NULL,
  completed_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for quiz questions
CREATE POLICY "Anyone can view quiz questions" 
ON public.quiz_questions 
FOR SELECT 
USING (true);

-- RLS policies for user quiz results
CREATE POLICY "Users can insert their own quiz results" 
ON public.user_quiz_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own quiz results" 
ON public.user_quiz_results 
FOR SELECT 
USING (auth.uid() = user_id);

-- Insert sample quiz questions
INSERT INTO public.quiz_questions (question_text, category, options, question_order) VALUES
('What type of learning environment works best for you?', 'personality', '["Quiet library with individual study space", "Group study sessions with friends", "Interactive classroom discussions", "Online courses with flexibility"]', 1),
('Which activity energizes you the most?', 'personality', '["Solving complex puzzles or problems", "Creating something new and original", "Analyzing data and finding patterns", "Leading a team project"]', 2),
('How do you prefer to communicate ideas?', 'personality', '["Written reports and documentation", "Visual presentations and graphics", "Face-to-face conversations", "Digital platforms and social media"]', 3),
('What motivates you most in your work?', 'goals', '["Making a positive impact on society", "Achieving financial success", "Continuous learning and growth", "Recognition and career advancement"]', 4),
('Which type of problem-solving appeals to you?', 'skills', '["Technical and logical challenges", "Creative and artistic solutions", "People and relationship issues", "Strategic and business problems"]', 5),
('What work environment do you thrive in?', 'interests', '["Fast-paced startup atmosphere", "Structured corporate environment", "Remote and flexible settings", "Collaborative team spaces"]', 6),
('Which skills would you like to develop further?', 'skills', '["Programming and technical skills", "Design and creative abilities", "Leadership and management", "Communication and presentation"]', 7),
('What type of impact do you want to make?', 'goals', '["Global and international reach", "Local community development", "Industry innovation", "Personal mentorship and teaching"]', 8),
('How do you approach new challenges?', 'personality', '["Research and plan thoroughly", "Jump in and learn by doing", "Collaborate and seek input", "Break down into smaller steps"]', 9),
('What interests you most about technology?', 'interests', '["Building and creating applications", "Understanding how things work", "Using it to solve real problems", "Teaching others to use it"]', 10),
('Which career aspect is most important to you?', 'goals', '["Work-life balance", "High earning potential", "Job security and stability", "Opportunity for creativity"]', 11),
('How do you prefer to learn new skills?', 'interests', '["Hands-on practice and experimentation", "Structured courses and certifications", "Mentorship and guidance", "Self-directed research and study"]', 12);