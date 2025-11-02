import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, TrendingUp, Star, Code, Palette, Users, Calculator, BookOpen, Microscope, Award, RotateCcw } from 'lucide-react';

interface DegreeAptitudeResult {
  computerScience: number;
  engineering: number;
  medicine: number;
  business: number;
  arts: number;
  science: number;
  law: number;
  design: number;
}

interface DegreeAptitudeResultsProps {
  results: DegreeAptitudeResult;
  onContinueToBranches: () => void;
  onRetakeQuiz?: () => void;
}

const branchInfo = {
  computerScience: {
    name: 'Computer Science',
    icon: <Code className="w-6 h-6" />,
    color: 'blue',
    description: 'Software development, AI, data science, and technology innovation',
    careers: ['Software Engineer', 'Data Scientist', 'AI Engineer', 'Full Stack Developer'],
    salary: '₹6-15 LPA'
  },
  engineering: {
    name: 'Engineering',
    icon: <Target className="w-6 h-6" />,
    color: 'green',
    description: 'Designing, building, and maintaining technological systems and infrastructure',
    careers: ['Mechanical Engineer', 'Civil Engineer', 'Electrical Engineer', 'Chemical Engineer'],
    salary: '₹5-12 LPA'
  },
  medicine: {
    name: 'Medicine',
    icon: <Microscope className="w-6 h-6" />,
    color: 'red',
    description: 'Healthcare, medical research, and patient care',
    careers: ['Doctor', 'Surgeon', 'Pharmacist', 'Medical Researcher'],
    salary: '₹8-25 LPA'
  },
  business: {
    name: 'Business & Management',
    icon: <Users className="w-6 h-6" />,
    color: 'purple',
    description: 'Corporate management, entrepreneurship, and business strategy',
    careers: ['Business Analyst', 'Marketing Manager', 'Entrepreneur', 'Management Consultant'],
    salary: '₹6-18 LPA'
  },
  arts: {
    name: 'Arts & Humanities',
    icon: <Palette className="w-6 h-6" />,
    color: 'pink',
    description: 'Creative expression, literature, philosophy, and cultural studies',
    careers: ['Writer', 'Journalist', 'Teacher', 'Content Creator'],
    salary: '₹3-8 LPA'
  },
  science: {
    name: 'Pure Sciences',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'cyan',
    description: 'Research, teaching, and advanced scientific study',
    careers: ['Research Scientist', 'Professor', 'Lab Technician', 'Science Writer'],
    salary: '₹4-10 LPA'
  },
  law: {
    name: 'Law & Justice',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'orange',
    description: 'Legal practice, policy-making, and justice system',
    careers: ['Lawyer', 'Judge', 'Legal Consultant', 'Policy Analyst'],
    salary: '₹5-15 LPA'
  },
  design: {
    name: 'Design & Creative',
    icon: <Palette className="w-6 h-6" />,
    color: 'indigo',
    description: 'Visual design, UX/UI, fashion, and creative industries',
    careers: ['UX Designer', 'Graphic Designer', 'Fashion Designer', 'Creative Director'],
    salary: '₹4-12 LPA'
  }
};

export const DegreeAptitudeResults: React.FC<DegreeAptitudeResultsProps> = ({
  results,
  onContinueToBranches,
  onRetakeQuiz
}) => {
  // Sort branches by score (highest first)
  const sortedBranches = Object.entries(results)
    .sort(([, a], [, b]) => b - a)
    .map(([branch, score]) => ({ branch, score }));

  const topBranches = sortedBranches.slice(0, 3);
  const maxScore = Math.max(...Object.values(results));

  const getScoreColor = (score: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getBranchRecommendation = (branch: string, score: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'Excellent Match - Highly Recommended';
    if (percentage >= 60) return 'Good Match - Consider This Field';
    if (percentage >= 40) return 'Fair Match - Worth Exploring';
    return 'Low Match - May Not Be Ideal';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <h2 className="text-3xl font-bold">Your Degree Branch Assessment Results</h2>
        </div>
        <p className="text-muted-foreground text-lg">
          Based on your responses, here are your interest levels across different degree branches
        </p>
      </div>

      {/* Top Recommendations */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <Award className="w-6 h-6" />
            Your Top 3 Recommended Branches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topBranches.map(({ branch, score }, index) => {
              const info = branchInfo[branch as keyof typeof branchInfo];
              return (
                <div key={branch} className="text-center">
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {index === 0 && <Trophy className="w-8 h-8" />}
                      {index === 1 && <Star className="w-8 h-8" />}
                      {index === 2 && <TrendingUp className="w-8 h-8" />}
                    </div>
                    <Badge className="absolute -top-2 -right-2 bg-primary">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className={`p-2 rounded-lg ${
                      index === 0 ? 'bg-yellow-100' :
                      index === 1 ? 'bg-gray-100' :
                      'bg-orange-100'
                    }`}>
                      {info.icon}
                    </span>
                    <h3 className="font-semibold">{info.name}</h3>
                  </div>
                  <div className={`text-2xl font-bold mb-2 ${getScoreColor(score)} px-2 py-1 rounded`}>
                    {score} points
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {getBranchRecommendation(branch, score)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Avg. Salary: {info.salary}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Detailed Interest Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedBranches.map(({ branch, score }) => {
              const info = branchInfo[branch as keyof typeof branchInfo];
              const percentage = (score / maxScore) * 100;

              return (
                <div key={branch} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      percentage >= 80 ? 'bg-green-100 text-green-600' :
                      percentage >= 60 ? 'bg-blue-100 text-blue-600' :
                      percentage >= 40 ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{info.name}</h4>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(score)} px-2 py-1 rounded`}>
                        {score}
                      </div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>

                  <Progress value={percentage} className="mb-3" />

                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Interest Level</span>
                    <span>{percentage.toFixed(0)}%</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium">Top Careers:</p>
                    <div className="flex flex-wrap gap-1">
                      {info.careers.slice(0, 2).map((career, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {career}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Career Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Star className="w-5 h-5" />
            Career Insights Based on Your Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-green-600">Your Strengths</h4>
                <ul className="text-sm space-y-1">
                  <li>• Strong interest in {topBranches[0].branch.replace(/([A-Z])/g, ' $1').trim()}</li>
                  <li>• Good analytical and problem-solving skills</li>
                  <li>• Ability to work with complex systems</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-600">Recommended Next Steps</h4>
                <ul className="text-sm space-y-1">
                  <li>• Research degree programs in your top branches</li>
                  <li>• Talk to professionals in your preferred fields</li>
                  <li>• Consider internships or part-time work</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          onClick={onContinueToBranches}
          className="px-8"
        >
          Explore Degree Branches →
        </Button>
        {onRetakeQuiz && (
          <Button
            variant="outline"
            size="lg"
            onClick={onRetakeQuiz}
            className="px-8"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Assessment
          </Button>
        )}
      </div>
    </div>
  );
};