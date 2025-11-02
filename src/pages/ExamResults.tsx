import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Clock, RotateCcw, Home, Lightbulb } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type ExamResult = Tables<'user_exam_results'> & {
  exams?: Tables<'exams'>;
};

export default function ExamResults() {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<ExamResult | null>(null);
  const [suggestions, setSuggestions] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!resultId) return;

    const fetchResults = async () => {
      try {
        // First try to get the actual results from sessionStorage (set during submit)
        const storedResult = sessionStorage.getItem(`exam-result-${resultId}`);
        let resultData;
        let exam;

        if (storedResult) {
          // Use the actual results from the submit API
          const parsedResult = JSON.parse(storedResult);
          resultData = {
            id: resultId,
            score: parsedResult.score,
            correct_answers: parsedResult.correct,
            total_questions: parsedResult.total,
            time_taken_minutes: parsedResult.timeTakenMinutes,
            exam_id: parsedResult.examId,
            completed_at: new Date().toISOString()
          };

          // Parse exam details from examId
          if (parsedResult.examId.startsWith('dynamic-exam-')) {
            const parts = parsedResult.examId.split('-');
            if (parts.length >= 5) {
              const interest = parts.slice(3, -1).join('-');
              const difficultyIndex = parseInt(parts[parts.length - 1]);

              const examVariations = [
                {
                  title: `${interest.charAt(0).toUpperCase() + interest.slice(1)} Fundamentals`,
                  subject: interest,
                  difficulty: 'easy',
                  duration_minutes: 20,
                  total_questions: 10,
                  passing_score: 60
                },
                {
                  title: `Advanced ${interest.charAt(0).toUpperCase() + interest.slice(1)}`,
                  subject: interest,
                  difficulty: 'medium',
                  duration_minutes: 30,
                  total_questions: 15,
                  passing_score: 70
                }
              ];

              exam = examVariations[difficultyIndex] || examVariations[0];
            }
          } else {
            exam = {
              title: 'Exam',
              subject: 'general',
              passing_score: 60
            };
          }

          // Set suggestions from stored result
          setSuggestions(parsedResult.suggestions || 'Focus on reviewing the fundamental concepts and practice regularly.');
        } else {
          // Fallback: try database (for backward compatibility)
          const { data: examResult, error: resultError } = await supabase
            .from('user_exam_results')
            .select('*')
            .eq('id', resultId)
            .single();

          if (resultError || !examResult) {
            console.warn('Exam result not found in storage or database');
            resultData = {
              id: resultId,
              score: 0,
              correct_answers: 0,
              total_questions: 10,
              time_taken_minutes: 0,
              exam_id: 'unknown',
              completed_at: new Date().toISOString()
            };
            exam = {
              title: 'Exam',
              subject: 'general',
              passing_score: 60
            };
          } else {
            resultData = examResult;
            exam = {
              title: 'Exam',
              subject: 'general',
              passing_score: 60
            };
          }
        }

        setResult({ ...resultData, exams: exam });

        // Suggestions are now loaded from stored results above
      } catch (err) {
        console.error('Failed to fetch results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [resultId]);

  const handleRetakeExam = () => {
    if (result) {
      navigate(`/exam/${result.exam_id}`);
    }
  };

  const handleBackToExams = () => {
    navigate('/exams');
  };

  const handleViewHistory = () => {
    navigate('/exam-history');
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading results...</div>
        </div>
      </Layout>
    );
  }

  if (!result) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-500">Results not found</div>
        </div>
      </Layout>
    );
  }

  const percentage = result.score;
  const isPassed = percentage >= (result.exams?.passing_score || 60);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className={`w-8 h-8 ${isPassed ? 'text-yellow-500' : 'text-gray-500'}`} />
            <h1 className="text-3xl font-bold text-foreground">Exam Results</h1>
          </div>
          <p className="text-muted-foreground">{result.exams?.title}</p>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-foreground mb-2">{percentage}%</div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <Progress value={percentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {result.correct_answers}/{result.total_questions}
              </div>
              <p className="text-sm text-muted-foreground">Correct Answers</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-3xl font-bold text-foreground">{result.time_taken_minutes}</span>
              </div>
              <p className="text-sm text-muted-foreground">Minutes Taken</p>
            </CardContent>
          </Card>
        </div>

        {/* Pass/Fail Status */}
        <Card className="mb-8">
          <CardContent className="p-6 text-center">
            <Badge
              variant={isPassed ? "default" : "destructive"}
              className="text-lg px-4 py-2"
            >
              {isPassed ? "PASSED" : "FAILED"}
            </Badge>
            <p className="text-muted-foreground mt-2">
              Passing score: {result.exams?.passing_score || 60}%
            </p>
          </CardContent>
        </Card>

        {/* Improvement Suggestions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              {suggestions ? (
                <div className="whitespace-pre-wrap">{suggestions}</div>
              ) : (
                <p className="text-muted-foreground">Generating suggestions...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleRetakeExam} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Retake Exam
          </Button>
          <Button variant="outline" onClick={handleViewHistory} className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            View History
          </Button>
          <Button variant="outline" onClick={handleBackToExams} className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Back to Exams
          </Button>
        </div>
      </div>
    </Layout>
  );
}