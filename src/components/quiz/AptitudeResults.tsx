import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calculator, Atom, Leaf, Briefcase, BookOpen, Palette, Cpu, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

interface AptitudeResult {
  mathematics: number;
  physics: number;
  chemistry: number;
  biology: number;
  commerce: number;
  humanities: number;
  arts: number;
  technology: number;
}

interface AptitudeResultsProps {
  results: AptitudeResult;
  onContinueToStreams: () => void;
}

export const AptitudeResults: React.FC<AptitudeResultsProps> = ({ results, onContinueToStreams }) => {
  const getSubjectInfo = (subject: keyof AptitudeResult) => {
    const subjectData = {
      mathematics: { name: 'Mathematics', icon: Calculator, color: 'blue', streams: ['MPC', 'MEC'] },
      physics: { name: 'Physics', icon: Atom, color: 'purple', streams: ['MPC', 'BiPC'] },
      chemistry: { name: 'Chemistry', icon: Atom, color: 'green', streams: ['MPC', 'BiPC'] },
      biology: { name: 'Biology', icon: Leaf, color: 'green', streams: ['BiPC'] },
      commerce: { name: 'Commerce', icon: Briefcase, color: 'yellow', streams: ['CEC', 'MEC'] },
      humanities: { name: 'Humanities', icon: BookOpen, color: 'orange', streams: ['HEC'] },
      arts: { name: 'Arts', icon: Palette, color: 'pink', streams: ['HEC'] },
      technology: { name: 'Technology', icon: Cpu, color: 'indigo', streams: ['MPC', 'CEC'] }
    };
    return subjectData[subject];
  };

  const getRecommendedStreams = () => {
    const recommendations = {
      MPC: (results.mathematics + results.physics + results.chemistry + results.technology) / 4,
      BiPC: (results.biology + results.physics + results.chemistry) / 3,
      CEC: (results.commerce + results.mathematics + results.technology) / 3,
      HEC: (results.humanities + results.arts) / 2,
      MEC: (results.mathematics + results.commerce + results.technology) / 3
    };

    return Object.entries(recommendations)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([stream, score]) => ({ stream, score: Math.round(score) }));
  };

  const recommendedStreams = getRecommendedStreams();

  const getProgressColor = (percentage: number) => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getInterestLevel = (percentage: number) => {
    if (percentage >= 70) return { level: 'High', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 50) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Low', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className="w-8 h-8 text-green-600" />
          <h2 className="text-3xl font-bold">Your Aptitude Assessment Results</h2>
        </div>
        <p className="text-muted-foreground text-lg">
          Based on your answers, here's your interest profile across different subjects
        </p>
      </div>

      {/* Interest Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Subject Interest Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(results).map(([subject, percentage]) => {
              const subjectInfo = getSubjectInfo(subject as keyof AptitudeResult);
              const interestLevel = getInterestLevel(percentage);
              const IconComponent = subjectInfo.icon;

              return (
                <div key={subject} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <IconComponent className={`w-6 h-6 text-${subjectInfo.color}-600`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{subjectInfo.name}</span>
                        <Badge className={`${interestLevel.bg} ${interestLevel.color} border-0`}>
                          {interestLevel.level}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                          <span>Interest Level</span>
                          <span>{percentage}%</span>
                        </div>
                        <Progress
                          value={percentage}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Streams */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <CheckCircle className="w-5 h-5" />
            Recommended Intermediate Streams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-blue-700 dark:text-blue-300 mb-4">
            Based on your interests, here are the intermediate streams that best match your profile:
          </p>

          <div className="grid gap-4">
            {recommendedStreams.map(({ stream, score }, index) => {
              const streamInfo = {
                MPC: { name: 'MPC (Math, Physics, Chemistry)', desc: 'Perfect for Engineering, Architecture, Pure Sciences', icon: '🔬' },
                BiPC: { name: 'BiPC (Biology, Physics, Chemistry)', desc: 'Ideal for Medical, Pharmacy, Biotechnology', icon: '🧬' },
                CEC: { name: 'CEC (Civics, Economics, Commerce)', desc: 'Great for Business, Finance, Chartered Accountancy', icon: '📊' },
                HEC: { name: 'HEC (History, Economics, Civics)', desc: 'Suitable for Humanities, Civil Services, Social Sciences', icon: '📚' },
                MEC: { name: 'MEC (Math, Economics, Commerce)', desc: 'Excellent for Finance, Business Analytics, Management', icon: '💰' }
              };

              const info = streamInfo[stream as keyof typeof streamInfo];

              return (
                <div
                  key={stream}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    index === 0
                      ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-950/20'
                      : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{info.icon}</span>
                      <div>
                        <h3 className="font-semibold">{info.name}</h3>
                        <p className="text-sm text-muted-foreground">{info.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{score}%</div>
                      <div className="text-xs text-muted-foreground">Match Score</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Career Insights */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Career Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Your Strengths</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                {Object.entries(results)
                  .filter(([, score]) => score >= 60)
                  .map(([subject]) => (
                    <li key={subject}>• Strong interest in {getSubjectInfo(subject as keyof AptitudeResult).name}</li>
                  ))}
              </ul>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Areas to Explore</h4>
              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                {Object.entries(results)
                  .filter(([, score]) => score < 50)
                  .map(([subject]) => (
                    <li key={subject}>• Consider exploring {getSubjectInfo(subject as keyof AptitudeResult).name}</li>
                  ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={onContinueToStreams}
          className="px-8 py-3 text-lg"
        >
          Explore Recommended Streams
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Click to see detailed syllabus, roadmap, opportunities, and resources for your recommended streams
        </p>
      </div>
    </div>
  );
};