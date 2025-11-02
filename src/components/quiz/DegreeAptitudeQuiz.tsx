import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Brain, Target, Code, Palette, Users, Calculator, BookOpen, Microscope } from 'lucide-react';

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

interface DegreeAptitudeQuizProps {
  onQuizComplete: (results: DegreeAptitudeResult) => void;
}

const degreeQuestions = [
  {
    id: 1,
    question: "When solving complex problems, I prefer to:",
    options: [
      { text: "Use logical reasoning and mathematical approaches", branch: "engineering", weight: 3 },
      { text: "Analyze data and find patterns", branch: "computerScience", weight: 3 },
      { text: "Work with people and understand their needs", branch: "business", weight: 2 },
      { text: "Create visual or artistic solutions", branch: "design", weight: 3 }
    ]
  },
  {
    id: 2,
    question: "In a group project, I would most enjoy:",
    options: [
      { text: "Leading the team and coordinating tasks", branch: "business", weight: 3 },
      { text: "Designing the user interface or presentation", branch: "design", weight: 3 },
      { text: "Writing code or building the technical solution", branch: "computerScience", weight: 3 },
      { text: "Researching and analyzing data", branch: "science", weight: 2 }
    ]
  },
  {
    id: 3,
    question: "Which subject interests you most for future study?",
    options: [
      { text: "Computer Programming and Algorithms", branch: "computerScience", weight: 4 },
      { text: "Mechanical or Electrical Engineering", branch: "engineering", weight: 4 },
      { text: "Human Anatomy and Medical Sciences", branch: "medicine", weight: 4 },
      { text: "Business Management and Economics", branch: "business", weight: 4 }
    ]
  },
  {
    id: 4,
    question: "I am most motivated by:",
    options: [
      { text: "Solving technical challenges and innovation", branch: "engineering", weight: 3 },
      { text: "Helping others and making a difference", branch: "medicine", weight: 3 },
      { text: "Building successful companies and wealth", branch: "business", weight: 3 },
      { text: "Creating beautiful and functional designs", branch: "design", weight: 3 }
    ]
  },
  {
    id: 5,
    question: "Which work environment appeals to you most?",
    options: [
      { text: "Research laboratory or hospital", branch: "medicine", weight: 3 },
      { text: "Modern office with creative teams", branch: "design", weight: 3 },
      { text: "Tech startup or software company", branch: "computerScience", weight: 3 },
      { text: "Corporate office or business firm", branch: "business", weight: 3 }
    ]
  },
  {
    id: 6,
    question: "I excel at:",
    options: [
      { text: "Mathematics and logical problem-solving", branch: "engineering", weight: 3 },
      { text: "Creative thinking and artistic expression", branch: "arts", weight: 3 },
      { text: "Understanding complex systems and data", branch: "computerScience", weight: 3 },
      { text: "Communicating and persuading others", branch: "law", weight: 3 }
    ]
  },
  {
    id: 7,
    question: "My ideal career involves:",
    options: [
      { text: "Working with cutting-edge technology", branch: "computerScience", weight: 4 },
      { text: "Designing products that people love", branch: "design", weight: 4 },
      { text: "Managing teams and growing businesses", branch: "business", weight: 4 },
      { text: "Conducting scientific research", branch: "science", weight: 4 }
    ]
  },
  {
    id: 8,
    question: "Which skill would you most like to develop?",
    options: [
      { text: "Programming and software development", branch: "computerScience", weight: 3 },
      { text: "Engineering design and prototyping", branch: "engineering", weight: 3 },
      { text: "Medical diagnosis and patient care", branch: "medicine", weight: 3 },
      { text: "Legal research and argumentation", branch: "law", weight: 3 }
    ]
  },
  {
    id: 9,
    question: "I am most interested in:",
    options: [
      { text: "How things work and building new devices", branch: "engineering", weight: 3 },
      { text: "Human behavior and psychology", branch: "arts", weight: 3 },
      { text: "Digital innovation and AI", branch: "computerScience", weight: 3 },
      { text: "Social issues and justice", branch: "law", weight: 3 }
    ]
  },
  {
    id: 10,
    question: "Which achievement would make you proudest?",
    options: [
      { text: "Developing a life-saving medical treatment", branch: "medicine", weight: 4 },
      { text: "Building a successful tech startup", branch: "business", weight: 4 },
      { text: "Creating a revolutionary software application", branch: "computerScience", weight: 4 },
      { text: "Designing an award-winning product", branch: "design", weight: 4 }
    ]
  }
];

export const DegreeAptitudeQuiz: React.FC<DegreeAptitudeQuizProps> = ({ onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<DegreeAptitudeResult>({
    computerScience: 0,
    engineering: 0,
    medicine: 0,
    business: 0,
    arts: 0,
    science: 0,
    law: 0,
    design: 0
  });

  const currentQuestion = degreeQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / degreeQuestions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const handleAnswerSelect = (questionId: number, selectedOption: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption.branch
    }));

    // Update results immediately
    setResults(prev => ({
      ...prev,
      [selectedOption.branch]: prev[selectedOption.branch as keyof DegreeAptitudeResult] + selectedOption.weight
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < degreeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz completed
      onQuizComplete(results);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getBranchIcon = (branch: string) => {
    const icons = {
      computerScience: <Code className="w-5 h-5" />,
      engineering: <Target className="w-5 h-5" />,
      medicine: <Microscope className="w-5 h-5" />,
      business: <Users className="w-5 h-5" />,
      arts: <Palette className="w-5 h-5" />,
      science: <BookOpen className="w-5 h-5" />,
      law: <BookOpen className="w-5 h-5" />,
      design: <Palette className="w-5 h-5" />
    };
    return icons[branch as keyof typeof icons] || <Brain className="w-5 h-5" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Degree Branch Aptitude Assessment</h2>
            </div>
            <Badge variant="secondary">
              Question {currentQuestionIndex + 1} of {degreeQuestions.length}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{answeredCount} answered</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                className={`w-full p-4 text-left border rounded-lg transition-all duration-200 hover:bg-muted/50 ${
                  answers[currentQuestion.id] === option.branch
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion.id] === option.branch
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  }`}>
                    {answers[currentQuestion.id] === option.branch && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="flex-1">{option.text}</span>
                  {answers[currentQuestion.id] === option.branch && (
                    <div className="flex items-center gap-1 text-primary">
                      {getBranchIcon(option.branch)}
                      <span className="text-sm capitalize">{option.branch.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          {degreeQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-primary text-primary-foreground'
                  : answers[degreeQuestions[index].id] !== undefined
                  ? 'bg-green-500 text-white'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
        >
          {currentQuestionIndex === degreeQuestions.length - 1 ? (
            <>
              Complete Assessment
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Live Results Preview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Your Current Interest Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(results).map(([branch, score]) => (
              <div key={branch} className="text-center">
                <div className="flex items-center justify-center mb-1">
                  {getBranchIcon(branch)}
                </div>
                <div className="text-sm font-medium capitalize">
                  {branch.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-lg font-bold text-primary">{score}</div>
                <div className="w-full bg-secondary rounded-full h-2 mt-1">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((score / 12) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Your scores update as you answer questions. Higher scores indicate stronger interest in that field.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};