import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Users, Brain, TrendingUp, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useCareerData } from "@/hooks/useCareerData";

const Index = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { userProgress } = useCareerData();

  if (!user) {
    // Redirect to landing for unauthenticated users
    window.location.href = '/';
    return null;
  }

  const benefits = [
    {
      icon: BookOpen,
      title: "Builds critical thinking and problem-solving abilities",
      description: "Develop analytical skills that help you approach challenges systematically"
    },
    {
      icon: Target,
      title: "Creates pathways to successful careers and opportunities",
      description: "Open doors to diverse career paths and professional growth"
    },
    {
      icon: Users,
      title: "Develops leadership skills and social responsibility",
      description: "Build confidence and learn to contribute positively to society"
    },
    {
      icon: Globe,
      title: "Strengthens communities and drives economic growth",
      description: "Educated individuals contribute to innovation and societal progress"
    },
    {
      icon: Brain,
      title: "Shapes the future leaders of tomorrow",
      description: "Prepare for leadership roles and make meaningful impact"
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome back to Career Navigator! 🚀
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Continue your career journey with AI-powered insights, personalized learning paths, and collaborative opportunities.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="mt-6 bg-primary hover:bg-primary-hover text-primary-foreground">
              Go to Dashboard →
            </Button>
          </Link>
        </div>

        {/* Education Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Education <span className="text-primary">Empowers Dreams</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Every great achievement begins with education. It's the key that unlocks doors to endless possibilities, 
              builds confidence, and creates pathways to success for students across India.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="bg-card border-border shadow-card hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        {profile && (
          <Card className="bg-card border-border shadow-card">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Your Learning Journey</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {userProgress?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Career Paths</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {profile.total_points || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Points Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {profile.streak_days || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Day Learning Streak</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Index;
