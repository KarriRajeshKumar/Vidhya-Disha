import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  skills_required: string[];
  total_steps: number;
  icon: string;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  career_path_id: string;
  current_step: number;
  completed_steps: number;
  progress_percentage: number;
  started_at: string;
  last_activity: string;
  career_paths: CareerPath;
}

export const useCareerData = () => {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    try {
      // Fetch all career paths
      const { data: paths, error: pathsError } = await supabase
        .from('career_paths')
        .select('*')
        .order('created_at', { ascending: true });

      if (pathsError) throw pathsError;

      // Fetch user progress if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      let progress: UserProgress[] = [];

      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_career_progress')
          .select(`
            *,
            career_paths:career_path_id (*)
          `)
          .eq('user_id', user.id);

        if (progressError) throw progressError;
        progress = progressData || [];
      }

      setCareerPaths(paths || []);
      setUserProgress(progress);
    } catch (error) {
      console.error('Error fetching career data:', error);
      toast({
        title: "Error",
        description: "Failed to load career data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startCareerPath = async (careerPathId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_career_progress')
        .insert({
          user_id: user.id,
          career_path_id: careerPathId,
          current_step: 1,
          completed_steps: 0,
          progress_percentage: 0,
        })
        .select(`
          *,
          career_paths:career_path_id (*)
        `)
        .single();

      if (error) throw error;

      setUserProgress(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Career path started!",
      });
    } catch (error) {
      console.error('Error starting career path:', error);
      toast({
        title: "Error",
        description: "Failed to start career path",
        variant: "destructive",
      });
    }
  };

  return {
    careerPaths,
    userProgress,
    loading,
    startCareerPath,
    refetch: fetchCareerData,
  };
};