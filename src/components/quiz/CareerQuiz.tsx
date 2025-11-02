import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface QuizQuestion {
  id: string;
  question_text: string;
  category: string;
  options: string[];
  question_order: number;
}

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

interface CareerQuizProps {
  onQuizComplete: (results: {
    sessionId: string;
    profileAnalysis: ProfileAnalysis;
    careerRecommendations: CareerRecommendation[];
  }) => void;
}

export const CareerQuiz: React.FC<CareerQuizProps> = ({ onQuizComplete }) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchQuizQuestions();
  }, []);

  const fetchQuizQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('question_order');

      if (error) throw error;
      
      const formattedQuestions = (data || []).map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string)
      }));
      
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      toast.error('Failed to load quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      processQuizResults(newAnswers);
    }
  };

  const processQuizResults = async (finalAnswers: string[]) => {
    if (!user) {
      toast.error('Please log in to complete the quiz');
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-quiz-processor', {
        body: {
          answers: finalAnswers,
          userId: user.id
        }
      });

      if (error) throw error;

      onQuizComplete(data);
      toast.success('Quiz completed successfully!');
    } catch (error) {
      console.error('Error processing quiz results:', error);
      toast.error('Failed to process quiz results');
    } finally {
      setProcessing(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Processing your results...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No quiz questions available</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-xl">{currentQuestion.question_text}</CardTitle>
          <div className="text-sm text-muted-foreground capitalize">
            Category: {currentQuestion.category}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 hover:border-primary ${
                  selectedOption === option
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1">{option}</span>
                  {selectedOption === option && (
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 ml-2" />
                  )}
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!selectedOption}
              className="min-w-[100px]"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Complete Quiz' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};