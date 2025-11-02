import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, ChevronLeft, ChevronRight, CheckCircle, Target, BookOpen, Calculator, Atom, Leaf, Briefcase, Palette } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  category: string;
  icon: string;
}

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

interface AptitudeQuizProps {
  onQuizComplete: (results: AptitudeResult) => void;
}

const questions: Question[] = [
  {
    id: 1,
    question: "Which subject do you find most interesting to solve problems in?",
    options: ["Solving mathematical equations", "Understanding how machines work", "Learning about chemical reactions", "Studying living organisms", "Analyzing business scenarios", "Reading about history and society", "Creating art and designs", "Working with computers and technology"],
    category: "interest",
    icon: "🧮"
  },
  {
    id: 2,
    question: "What type of projects would you enjoy working on?",
    options: ["Mathematical modeling and calculations", "Building and designing mechanical systems", "Conducting experiments in a lab", "Researching environmental or medical topics", "Financial planning and market analysis", "Writing articles or studying cultures", "Designing graphics or creative content", "Developing apps or programming"],
    category: "project",
    icon: "🔬"
  },
  {
    id: 3,
    question: "Which career field appeals to you the most?",
    options: ["Engineering or Architecture", "Medical or Healthcare", "Research or Scientific work", "Business or Finance", "Teaching or Social work", "Journalism or Media", "Design or Creative arts", "IT or Computer Science"],
    category: "career",
    icon: "🎯"
  },
  {
    id: 4,
    question: "What do you enjoy learning about in your free time?",
    options: ["Mathematics and logical puzzles", "Physics and how things work", "Chemistry and scientific discoveries", "Biology and nature", "Economics and current affairs", "History and literature", "Art and music", "Technology and gadgets"],
    category: "learning",
    icon: "📚"
  },
  {
    id: 5,
    question: "Which school subject do you perform best in?",
    options: ["Mathematics", "Physics", "Chemistry", "Biology", "Business Studies", "Social Science", "Arts/Crafts", "Computer Science"],
    category: "performance",
    icon: "📊"
  },
  {
    id: 6,
    question: "What kind of problems do you like to solve?",
    options: ["Mathematical and numerical problems", "Technical and mechanical problems", "Scientific and experimental problems", "Health and environmental problems", "Business and financial problems", "Social and ethical problems", "Creative and design problems", "Digital and programming problems"],
    category: "problem_solving",
    icon: "🧩"
  },
  {
    id: 7,
    question: "Which activity would you choose for a school project?",
    options: ["Creating mathematical models", "Building a working model", "Conducting chemical experiments", "Studying ecosystems", "Analyzing market trends", "Researching historical events", "Designing posters or websites", "Developing a mobile app"],
    category: "activity",
    icon: "🎨"
  },
  {
    id: 8,
    question: "What motivates you most in studies?",
    options: ["Solving complex equations", "Understanding scientific principles", "Discovering new knowledge", "Helping others and society", "Achieving financial success", "Understanding human behavior", "Expressing creativity", "Innovation and technology"],
    category: "motivation",
    icon: "💡"
  },
  {
    id: 9,
    question: "Which university course sounds most appealing?",
    options: ["B.Tech in Engineering", "MBBS or Medical", "B.Sc in Science", "B.Com or MBA", "BA in Humanities", "BFA in Fine Arts", "BCA or B.Tech in CS", "B.Pharm or Biotechnology"],
    category: "course",
    icon: "🎓"
  },
  {
    id: 10,
    question: "What do you see yourself doing in the future?",
    options: ["Working as an engineer or scientist", "Being a doctor or healthcare professional", "Researching in a lab", "Running a business", "Teaching or counseling", "Working in media or arts", "Designing or creating", "Developing technology solutions"],
    category: "future",
    icon: "🔮"
  }
];

export const AptitudeQuiz: React.FC<AptitudeQuizProps> = ({ onQuizComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const results: AptitudeResult = {
      mathematics: 0,
      physics: 0,
      chemistry: 0,
      biology: 0,
      commerce: 0,
      humanities: 0,
      arts: 0,
      technology: 0
    };

    // Map answers to interest categories
    Object.entries(answers).forEach(([questionId, answerIndex]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      if (!question) return;

      // Each answer index corresponds to a subject area
      const subjectMapping = [
        'mathematics', 'physics', 'chemistry', 'biology',
        'commerce', 'humanities', 'arts', 'technology'
      ];

      const subject = subjectMapping[answerIndex];
      if (subject && results[subject as keyof AptitudeResult] !== undefined) {
        (results as any)[subject] += 1;
      }
    });

    // Convert to percentages
    const totalQuestions = questions.length;
    Object.keys(results).forEach(key => {
      (results as any)[key] = Math.round(((results as any)[key] / totalQuestions) * 100);
    });

    setShowResults(true);
    onQuizComplete(results);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <h2 className="text-3xl font-bold">Assessment Completed!</h2>
          </div>
          <p className="text-muted-foreground text-lg">
            Analyzing your responses to generate personalized career recommendations...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Brain className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">Career Aptitude Assessment</h2>
        </div>
        <p className="text-muted-foreground text-lg">
          Discover your interests and strengths to find the perfect career path
        </p>
      </div>

      {/* Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Question {currentQuestion + 1} of {questions.length}</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </Card>

      {/* Question Card */}
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <span className="text-2xl">{currentQ.icon}</span>
            {currentQ.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(currentQ.id, index)}
                className={`p-4 text-left rounded-lg border-2 transition-all duration-200 hover:border-primary hover:bg-primary/5 ${
                  answers[currentQ.id] === index
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                    : 'border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQ.id] === index ? 'border-primary bg-primary' : 'border-gray-300'
                  }`}>
                    {answers[currentQ.id] === index && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-base">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <Button
          onClick={nextQuestion}
          disabled={answers[currentQ.id] === undefined}
          className="flex items-center gap-2"
        >
          {currentQuestion === questions.length - 1 ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Complete Assessment
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Assessment Tips</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Choose the option that best represents your genuine interests and strengths.
                There are no right or wrong answers - this helps identify your natural inclinations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};