import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Trophy, Users, Lightbulb, Calendar, Users2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useCareerData } from "@/hooks/useCareerData";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { profile, loading: profileLoading } = useProfile();
  const { userProgress, loading: careerLoading } = useCareerData();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return;

      // Fetch user achievements
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements (*)
        `)
        .eq('user_id', profile.user_id)
        .order('earned_at', { ascending: false })
        .limit(3);

      // Fetch upcoming events
      const { data: upcomingEvents } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(3);

      setAchievements(userAchievements || []);
      setEvents(upcomingEvents || []);

      // Generate personalized insights based on user data
      if (profile) {
        const personalizedInsights = [
          `${profile.display_name || 'User'} has ${profile.skills?.length || 0} skills listed and is at ${profile.experience_level} level. ${profile.total_points > 100 ? 'Great progress with ' + profile.total_points + ' points earned!' : 'Just getting started with ' + profile.total_points + ' points.'}`,
          `Current learning streak: ${profile.streak_days} days. ${profile.streak_days > 7 ? 'Excellent consistency!' : 'Consider building a regular learning habit.'}`,
          `Progress in career exploration: ${userProgress.length} paths started. ${userProgress.length > 0 ? 'Keep up the momentum!' : 'Explore career paths to unlock personalized recommendations.'}`,
        ];
        setInsights(personalizedInsights);
      }
    };

    fetchData();
  }, [profile, userProgress]);

  if (profileLoading || careerLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading your dashboard...</div>
        </div>
      </Layout>
    );
  }

  const profileCompletion = profile ? Math.round(
    ((profile.display_name ? 1 : 0) +
     (profile.email ? 1 : 0) +
     (profile.bio ? 1 : 0) +
     (profile.education_level ? 1 : 0) +
     (profile.skills?.length ? 1 : 0) +
     (profile.interests?.length ? 1 : 0)) / 6 * 100
  ) : 0;

  const explorationProgress = userProgress.length > 0 ? 
    Math.round(userProgress.reduce((acc, progress) => acc + progress.progress_percentage, 0) / userProgress.length) : 0;

  // Quick action handlers
  const handleCompleteProfile = () => {
    navigate("/profile");
  };

  const handleAIMentor = () => {
    navigate("/ai-mentor");
  };

  const handleJoinTeam = () => {
    navigate("/teams");
  };

  const handleViewAllAchievements = () => {
    navigate("/achievements");
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            Welcome back, {profile?.display_name || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's your career development progress and personalized insights.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Profile Completion</h3>
                <Target className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{profileCompletion}%</div>
              <ProgressBar value={profileCompletion} className="mb-2" />
              <p className="text-sm text-muted-foreground">Complete your profile to unlock more features</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Total Points</h3>
                <Trophy className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{profile?.total_points || 0}</div>
              <p className="text-sm text-muted-foreground">Earn points by completing activities and achieving milestones</p>
            </CardContent>
          </Card>

        </div>

        {/* AI-Powered Insights */}
        <Card className="mb-8 bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Lightbulb className="w-5 h-5 text-primary" />
              AI-Powered Insights
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Personalized recommendations based on your progress and goals
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-foreground">{insight}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-foreground mb-3">Recommended Next Steps:</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-foreground">Complete your profile and explore available career paths</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-foreground">Start learning new skills and track your progress</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 gap-8">
          {/* Recent Achievements */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Trophy className="w-5 h-5 text-primary" />
                Recent Achievements
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Your latest accomplishments and milestones
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start justify-between p-3 bg-secondary rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    <span className="text-sm font-medium text-success">{achievement.points}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={handleViewAllAchievements}>
                View All Achievements
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleCompleteProfile}>
            <Target className="w-6 h-6" />
            <span>Complete Profile</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleAIMentor}>
            <Lightbulb className="w-6 h-6" />
            <span>AI Mentor</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2" onClick={handleJoinTeam}>
            <Users2 className="w-6 h-6" />
            <span>Join Team</span>
          </Button>
        </div>
      </div>
    </Layout>
  );
}