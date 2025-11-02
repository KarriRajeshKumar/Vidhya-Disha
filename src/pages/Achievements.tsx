import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { useProfile } from "@/hooks/useProfile";
import { useCareerData } from "@/hooks/useCareerData";
import { useAchievements } from "@/hooks/useAchievements";
import { Trophy, Star, Target, Award, Calendar, CheckCircle, Loader2 } from "lucide-react";

export default function Achievements() {
  const { profile, loading: profileLoading } = useProfile();
  const { userProgress, loading: careerLoading } = useCareerData();
  const { achievements, userAchievements, loading: achievementsLoading, checkAchievements } = useAchievements();

  useEffect(() => {
    if (profile && userProgress) {
      const completedSteps = userProgress.reduce((sum, p) => sum + p.completed_steps, 0);
      const profileComplete = !!(profile.display_name && profile.email && profile.interests?.length);
      
      checkAchievements({
        completedSteps,
        totalPoints: profile.total_points,
        streakDays: profile.streak_days,
        profileComplete,
      });
    }
  }, [profile, userProgress, checkAchievements]);

  if (profileLoading || careerLoading || achievementsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const completedSteps = userProgress.reduce((sum, p) => sum + p.completed_steps, 0);
  const profileCompletePercentage = profile ? 
    Math.round(((profile.display_name ? 1 : 0) + 
               (profile.email ? 1 : 0) + 
               (profile.interests?.length ? 1 : 0) + 
               (profile.job_title ? 1 : 0)) / 4 * 100) : 0;

  const stats = [
    { icon: Trophy, value: userAchievements.length.toString(), title: "Total Achievements", color: "text-warning" },
    { icon: Star, value: profile?.total_points?.toString() || "0", title: "Total Points", color: "text-primary" },
    { icon: Target, value: `${profileCompletePercentage}%`, title: "Profile Complete", color: "text-success" },
    { icon: Award, value: completedSteps.toString(), title: "Steps Completed", color: "text-info" }
  ];

  const upcomingAchievements = achievements.filter(achievement => 
    !userAchievements.some(ua => ua.achievement_id === achievement.id) &&
    achievement.title !== "Mentor Help 3 team members complete their goals"
  ).map(achievement => {
    let progress = 0;
    let requirement = "";
    
    if (achievement.requirements) {
      const req = achievement.requirements;
      
      if (req.type === 'learning_cycles') {
        progress = Math.min((completedSteps / req.count) * 100, 100);
        requirement = `${completedSteps}/${req.count} cycles completed`;
      } else if (req.type === 'total_points') {
        progress = Math.min(((profile?.total_points || 0) / req.count) * 100, 100);
        requirement = `${profile?.total_points || 0}/${req.count} points earned`;
      } else if (req.type === 'streak_days') {
        progress = Math.min(((profile?.streak_days || 0) / req.count) * 100, 100);
        requirement = `${profile?.streak_days || 0}/${req.count} days streak`;
      } else if (req.type === 'profile_complete') {
        progress = profileCompletePercentage;
        requirement = `Profile ${profileCompletePercentage}% complete`;
      }
    }
    
    return {
      title: achievement.title,
      description: achievement.description,
      progress,
      requirement,
      points: achievement.points
    };
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common": return "text-muted-foreground";
      case "uncommon": return "text-success";
      case "rare": return "text-info";
      case "epic": return "text-warning";
      case "legendary": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Achievements & Badges</h1>
          <p className="text-muted-foreground mt-2">
            Track your progress and celebrate your accomplishments
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              valueColor={stat.color}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Earned Achievements */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Earned Achievements</h2>
            <div className="space-y-4">
              {userAchievements.length === 0 ? (
                <Card className="bg-card border-border shadow-card">
                  <CardContent className="p-6 text-center">
                    <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">No achievements yet</h3>
                    <p className="text-sm text-muted-foreground">Start learning and completing steps to earn your first achievement!</p>
                  </CardContent>
                </Card>
              ) : (
                userAchievements.map((userAchievement) => (
                  <Card key={userAchievement.id} className="bg-card border-border shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{userAchievement.achievements.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">{userAchievement.achievements.title}</h3>
                              <p className="text-sm text-muted-foreground">{userAchievement.achievements.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-primary">+{userAchievement.achievements.points} pts</div>
                              <Badge variant="outline" className="text-success">
                                Earned
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{userAchievement.achievements.category}</Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              {new Date(userAchievement.earned_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Achievements */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Upcoming Achievements</h2>
            <div className="space-y-4">
              {upcomingAchievements.map((achievement, index) => (
                <Card key={index} className="bg-card border-border shadow-card opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                          <div className="text-sm font-medium text-primary">+{achievement.points} pts</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">{achievement.requirement}</div>
                          <div className="w-full bg-progress-bg rounded-full h-2">
                            <div 
                              className="h-2 bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">{achievement.progress}% complete</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Achievement Categories */}
        <Card className="mt-8 bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Star className="w-5 h-5 text-primary" />
              Achievement Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Learning Milestones</h3>
                <p className="text-sm text-muted-foreground">Complete courses, cycles, and educational content</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Collaboration</h3>
                <p className="text-sm text-muted-foreground">Team participation and helping others succeed</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-warning" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Special Recognition</h3>
                <p className="text-sm text-muted-foreground">Exceptional performance and unique achievements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}