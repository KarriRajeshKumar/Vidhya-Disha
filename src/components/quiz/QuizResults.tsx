import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProfileAnalysis {
  technical: number;
  creative: number;
  analytical: number;
  leadership: number;
  communication: number;
  regionalImpact: number;
}

interface CareerRecommendation {
  title: string;
  description: string;
  matchScore: number;
  salaryRange: string;
  marketDemand: string;
  workLifeBalance: string;
  jobSecurity: string;
  category: string;
  icon: string;
  profileMatch: ProfileAnalysis;
}

interface QuizResultsProps {
  sessionId: string;
  profileAnalysis: ProfileAnalysis;
  careerRecommendations: CareerRecommendation[];
  onContinueToExplorer: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  sessionId,
  profileAnalysis,
  careerRecommendations,
  onContinueToExplorer
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-blue-600';
    if (score >= 40) return 'text-purple-600';
    return 'text-orange-600';
  };

  const getBadgeVariant = (value: string) => {
    switch (value.toLowerCase()) {
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'good': return 'default';
      case 'excellent': return 'default';
      case 'challenging': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Completion Header */}
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Quiz Completed! 🎉</h1>
        <p className="text-muted-foreground">
          Based on your answers, here are your personalized career recommendations:
        </p>
        <div className="text-xs text-muted-foreground mt-2">
          Session ID: {sessionId} • Questions were randomly selected for you
        </div>
      </div>

      {/* Profile Analysis */}
      <Card className="animate-scale-in" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle className="text-center">Your Profile Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(profileAnalysis).map(([key, value]) => {
              const labels = {
                technical: 'Technical',
                creative: 'Creative',
                analytical: 'Analytical',
                leadership: 'Leadership',
                communication: 'Communication',
                regionalImpact: 'Regional Impact'
              };
              
              return (
                <div key={key} className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${getScoreColor(value)}`}>
                    {value}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {labels[key as keyof typeof labels]}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Career Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careerRecommendations.map((career, index) => (
          <Card 
            key={index} 
            className="animate-scale-in hover:shadow-lg transition-all duration-300"
            style={{ animationDelay: `${400 + index * 150}ms` }}
          >
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{career.icon}</span>
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{career.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {career.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Match Score:</span>
                  <span className={`text-lg font-bold ${getScoreColor(career.matchScore)}`}>
                    {career.matchScore}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Salary Range:</span>
                  <span className="text-sm font-semibold">{career.salaryRange}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span>Market Demand:</span>
                    <Badge variant={getBadgeVariant(career.marketDemand)} className="text-xs">
                      {career.marketDemand}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Work-Life Balance:</span>
                    <Badge variant={getBadgeVariant(career.workLifeBalance)} className="text-xs">
                      {career.workLifeBalance}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Job Security:</span>
                    <Badge variant={getBadgeVariant(career.jobSecurity)} className="text-xs">
                      {career.jobSecurity}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <Badge variant="outline" className="text-xs">
                      {career.category}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium">Your Profile Match:</div>
                  <div className="space-y-1">
                    {Object.entries(career.profileMatch).slice(0, 3).map(([key, value]) => {
                      const labels = {
                        technical: 'Technical',
                        creative: 'Creative',
                        analytical: 'Analytical',
                        leadership: 'Leadership',
                        communication: 'Communication',
                        regionalImpact: 'Regional Impact'
                      };
                      
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-xs w-16">{labels[key as keyof typeof labels]}</span>
                          <Progress value={value} className="h-1 flex-1" />
                          <span className="text-xs w-8">{value}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Button */}
      <div className="text-center py-6">
        <Button 
          onClick={onContinueToExplorer}
          size="lg"
          className="animate-scale-in hover:scale-105 transition-all duration-300"
          style={{ animationDelay: '800ms' }}
        >
          Explore Career Paths <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};