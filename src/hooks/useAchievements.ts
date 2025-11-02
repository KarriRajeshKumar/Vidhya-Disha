import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  icon: string;
  requirements: any;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievements: Achievement;
}

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      // Fetch all achievements
      const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('created_at', { ascending: true });

      if (achievementsError) throw achievementsError;

      // Fetch user achievements if authenticated
      const { data: { user } } = await supabase.auth.getUser();
      let userAchievementsData: UserAchievement[] = [];

      if (user) {
        const { data: userAchievementsResponse, error: userAchievementsError } = await supabase
          .from('user_achievements')
          .select(`
            *,
            achievements:achievement_id (*)
          `)
          .eq('user_id', user.id);

        if (userAchievementsError) throw userAchievementsError;
        userAchievementsData = userAchievementsResponse || [];
      }

      setAchievements(allAchievements || []);
      setUserAchievements(userAchievementsData);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      toast({
        title: "Error",
        description: "Failed to load achievements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const earnAchievement = async (achievementId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId,
        })
        .select(`
          *,
          achievements:achievement_id (*)
        `)
        .single();

      if (error) throw error;

      setUserAchievements(prev => [...prev, data]);
      toast({
        title: "Achievement Unlocked!",
        description: `You've earned: ${data.achievements.title}`,
      });
    } catch (error) {
      console.error('Error earning achievement:', error);
      toast({
        title: "Error",
        description: "Failed to earn achievement",
        variant: "destructive",
      });
    }
  };

  const checkAchievements = (stats: {
    completedSteps: number;
    totalPoints: number;
    streakDays: number;
    profileComplete: boolean;
  }) => {
    achievements.forEach(achievement => {
      const alreadyEarned = userAchievements.some(ua => ua.achievement_id === achievement.id);
      if (alreadyEarned) return;

      let shouldEarn = false;

      // Check different achievement types
      if (achievement.requirements) {
        const req = achievement.requirements;
        
        if (req.type === 'learning_cycles' && stats.completedSteps >= req.count) {
          shouldEarn = true;
        } else if (req.type === 'total_points' && stats.totalPoints >= req.count) {
          shouldEarn = true;
        } else if (req.type === 'streak_days' && stats.streakDays >= req.count) {
          shouldEarn = true;
        } else if (req.type === 'profile_complete' && stats.profileComplete) {
          shouldEarn = true;
        }
      }

      if (shouldEarn) {
        earnAchievement(achievement.id);
      }
    });
  };

  return {
    achievements,
    userAchievements,
    loading,
    earnAchievement,
    checkAchievements,
    refetch: fetchAchievements,
  };
};