import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ExamData {
  sessionId: string;
  questions: Question[];
  exam: {
    id: string;
    title: string;
    duration_minutes: number;
  };
}

// Fallback question generator when AI fails
const generateFallbackQuestions = (exam: any, sessionId: string, interest?: string): Question[] => {
  const baseQuestions: Record<string, Question[]> = {
    'computer science': [
      {
        id: '',
        question: 'What does CPU stand for?',
        options: ['A) Central Processing Unit', 'B) Computer Personal Unit', 'C) Central Process Unit', 'D) Computer Processing Unit'],
        correctAnswer: 0
      },
      {
        id: '',
        question: 'Which data structure follows LIFO principle?',
        options: ['A) Queue', 'B) Stack', 'C) Array', 'D) Linked List'],
        correctAnswer: 1
      },
      {
        id: '',
        question: 'What is the time complexity of binary search?',
        options: ['A) O(n)', 'B) O(log n)', 'C) O(n²)', 'D) O(1)'],
        correctAnswer: 1
      }
    ],
    'web development': [
      {
        id: '',
        question: 'What does HTML stand for?',
        options: ['A) Hyper Text Markup Language', 'B) High Tech Modern Language', 'C) Hyper Transfer Markup Language', 'D) Home Tool Markup Language'],
        correctAnswer: 0
      },
      {
        id: '',
        question: 'Which CSS property is used to change text color?',
        options: ['A) font-color', 'B) text-color', 'C) color', 'D) foreground-color'],
        correctAnswer: 2
      },
      {
        id: '',
        question: 'What is the purpose of JavaScript?',
        options: ['A) Styling web pages', 'B) Creating web page structure', 'C) Adding interactivity to web pages', 'D) Storing data on servers'],
        correctAnswer: 2
      }
    ],
    'data science': [
      {
        id: '',
        question: 'What is the primary goal of data normalization?',
        options: ['A) Increase data size', 'B) Reduce data redundancy', 'C) Make data more complex', 'D) Remove all data'],
        correctAnswer: 1
      },
      {
        id: '',
        question: 'Which algorithm is used for classification problems?',
        options: ['A) Linear Regression', 'B) K-Means Clustering', 'C) Decision Trees', 'D) Principal Component Analysis'],
        correctAnswer: 2
      }
    ],
    'gaming': [
      {
        id: '',
        question: 'What does FPS stand for in gaming?',
        options: ['A) First Person Shooter', 'B) Fast Processing Speed', 'C) Frame Per Second', 'D) Full Performance System'],
        correctAnswer: 0
      },
      {
        id: '',
        question: 'Which company developed the game Fortnite?',
        options: ['A) Activision', 'B) Electronic Arts', 'C) Epic Games', 'D) Ubisoft'],
        correctAnswer: 2
      },
      {
        id: '',
        question: 'What is a "mod" in gaming?',
        options: ['A) A type of weapon', 'B) Modified game content', 'C) A game mode', 'D) A multiplayer server'],
        correctAnswer: 1
      }
    ],
    'javascript': [
      {
        id: '',
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: ['A) var myVar;', 'B) variable myVar;', 'C) v myVar;', 'D) declare myVar;'],
        correctAnswer: 0
      },
      {
        id: '',
        question: 'Which method is used to add an element to the end of an array?',
        options: ['A) push()', 'B) add()', 'C) append()', 'D) insert()'],
        correctAnswer: 0
      }
    ],
    'react': [
      {
        id: '',
        question: 'What is JSX in React?',
        options: ['A) A database', 'B) A syntax extension', 'C) A styling library', 'D) A testing framework'],
        correctAnswer: 1
      },
      {
        id: '',
        question: 'What hook is used for state management in React?',
        options: ['A) useEffect', 'B) useState', 'C) useContext', 'D) useReducer'],
        correctAnswer: 1
      }
    ]
  };

  // Use interest if provided, otherwise fall back to exam subject
  const searchKey = (interest || exam.subject || '').toLowerCase().trim();
  const subjectQuestions = baseQuestions[searchKey] || baseQuestions['computer science'];

  // Return the required number of questions, cycling if needed
  const questions: Question[] = [];
  for (let i = 0; i < exam.total_questions; i++) {
    const questionIndex = i % subjectQuestions.length;
    const baseQuestion = subjectQuestions[questionIndex];
    questions.push({
      ...baseQuestion,
      id: `${sessionId}-q${i + 1}`
    });
  }

  return questions;
};

export default function ExamSession() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!examId || !profile?.user_id) return;

    const startExam = async () => {
      try {
        // Parse exam details from the ID for display purposes
        let exam;

        if (examId.startsWith('dynamic_exam_')) {
          // Parse dynamic exam details from ID: dynamic_exam_{userId}_{interest}_{index}
          const parts = examId.split('_');
          if (parts.length >= 5) {
            const interest = parts[3]; // Get interest from ID
            const difficultyIndex = parseInt(parts[4]);

            // Create exam object based on parsed data
            const examVariations = [
              {
                title: `${interest.charAt(0).toUpperCase() + interest.slice(1)} Fundamentals`,
                description: `Test your knowledge of ${interest} basics and core concepts.`,
                subject: interest,
                difficulty: 'easy',
                duration_minutes: 20,
                total_questions: 10,
                passing_score: 60
              },
              {
                title: `Advanced ${interest.charAt(0).toUpperCase() + interest.slice(1)}`,
                description: `Challenge yourself with advanced ${interest} topics and concepts.`,
                subject: interest,
                difficulty: 'medium',
                duration_minutes: 30,
                total_questions: 15,
                passing_score: 70
              }
            ];

            exam = {
              id: examId,
              ...examVariations[difficultyIndex] || examVariations[0]
            };
          } else {
            throw new Error('Invalid dynamic exam ID format');
          }
        } else if (examId.startsWith('default-')) {
          // Handle default exams
          const subject = examId === 'default-1' ? 'programming' : 'web';
          const totalQuestions = examId === 'default-1' ? 10 : 12;

          exam = {
            id: examId,
            title: examId === 'default-1' ? 'General Programming Fundamentals' : 'Web Development Essentials',
            description: examId === 'default-1' ? 'Basics of programming, algorithms, and data structures.' : 'HTML, CSS, JavaScript basics and web concepts.',
            subject,
            difficulty: 'easy',
            duration_minutes: examId === 'default-1' ? 20 : 25,
            total_questions: totalQuestions,
            passing_score: 60
          };
        } else {
          throw new Error('Unsupported exam type');
        }

        // Try to call backend API to start exam and generate questions
        let formattedQuestions: Question[] = [];
        let sessionId = `${examId}-${Date.now()}`;

        try {
          // Using mock data since backend is not available
          // TODO: Replace with actual API call when backend is ready
          console.log('Using mock exam data for development');
          
          // Mock response structure
          const startData = {
            sessionId: sessionId,
            questions: [],
            examId: examId
          };
          
          const { sessionId: apiSessionId, questions, examId: actualExamId } = startData;

          // Format questions for frontend
          formattedQuestions = questions.map((q: any, index: number) => ({
            id: q.id || `${apiSessionId}-q${index + 1}`,
            question: q.question_text || q.question,
            options: q.choices || q.options || [],
            correctAnswer: q.correct_index || q.correctAnswer || 0
          }));

          sessionId = apiSessionId;
          exam.id = actualExamId || exam.id;
        } catch (apiError) {
          console.warn('Backend API not available, using fallback questions:', apiError);
          // Use fallback questions when API fails
          formattedQuestions = generateFallbackQuestions(exam, sessionId, profile?.interests?.[0]);
        }

        const examData: ExamData = {
          sessionId,
          questions: formattedQuestions,
          exam: {
            id: exam.id,
            title: exam.title,
            duration_minutes: exam.duration_minutes
          }
        };

        setExamData(examData);
        setTimeLeft(exam.duration_minutes * 60); // Convert to seconds
      } catch (err) {
        console.error('Failed to start exam:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to start exam. Please try again.';
        alert(errorMessage);
        navigate('/exams');
      } finally {
        setLoading(false);
      }
    };

    startExam();
  }, [examId, profile?.user_id, navigate]);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || !examData) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, examData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < examData!.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitExam = async () => {
    if (!examData || submitting) return;

    setSubmitting(true);
    try {
      // Prepare answers for submission
      const formattedAnswers = examData.questions.map(question => ({
        questionId: question.id,
        selectedIndex: answers[question.id] || 0,
        isCorrect: answers[question.id] === question.correctAnswer
      }));

      const correctAnswers = formattedAnswers.filter(a => a.isCorrect).length;
      const totalQuestions = examData.questions.length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const timeTakenMinutes = Math.round((examData.exam.duration_minutes * 60 - timeLeft) / 60);

      // Try to call backend API to submit exam
      let resultId = `fallback-${Date.now()}`;

      try {
        // Using mock data since backend is not available
        // TODO: Replace with actual API call when backend is ready
        console.log('Using mock submit data for development');
        
        // Mock submit response
        const submitData = {
          resultId: `result-${Date.now()}`,
          score: Math.floor(Math.random() * 100),
          correct: Math.floor(Math.random() * formattedAnswers.length),
          total: formattedAnswers.length,
          passed: true
        };
        
        resultId = submitData.resultId;

        // Store the API results
        sessionStorage.setItem(`exam-result-${resultId}`, JSON.stringify({
          score: submitData.score,
          correct: submitData.correct,
          total: submitData.total,
          suggestions: submitData.suggestions,
          examId: examData.exam.id,
          timeTakenMinutes
        }));
      } catch (apiError) {
        console.warn('Backend API not available for submission, using local calculation:', apiError);

        // Generate suggestions based on performance
        const suggestions = [];
        if (score < 60) {
          suggestions.push("Review the basic concepts and try again.");
          suggestions.push("Consider taking a preparatory course.");
        } else if (score < 80) {
          suggestions.push("Good performance! Focus on weak areas.");
          suggestions.push("Practice more questions in this subject.");
        } else {
          suggestions.push("Excellent performance! Keep it up.");
          suggestions.push("Try advanced topics in this subject.");
        }

        // Store local results
        sessionStorage.setItem(`exam-result-${resultId}`, JSON.stringify({
          score,
          correct: correctAnswers,
          total: totalQuestions,
          suggestions,
          examId: examData.exam.id,
          timeTakenMinutes
        }));
      }

      // Navigate to results
      navigate(`/exam-results/${resultId}`);
    } catch (err) {
      console.error('Failed to submit exam:', err);
      alert('Failed to submit exam. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading exam...</div>
        </div>
      </Layout>
    );
  }

  if (!examData) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-500">Failed to load exam</div>
        </div>
      </Layout>
    );
  }

  const currentQuestion = examData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / examData.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">{examData.exam.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-lg font-mono">
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
              </div>
              <Button
                variant="destructive"
                onClick={handleSubmitExam}
                disabled={submitting}
              >
                <Flag className="w-4 h-4 mr-2" />
                Submit Exam
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {examData.questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              Answered: {answeredCount}
            </span>
          </div>

          <Progress value={progress} className="mb-4" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion.id]?.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
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
            {examData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-xs font-medium ${
                  index === currentQuestionIndex
                    ? 'bg-primary text-primary-foreground'
                    : answers[examData.questions[index].id] !== undefined
                    ? 'bg-green-500 text-white'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <Button
            onClick={currentQuestionIndex === examData.questions.length - 1 ? handleSubmitExam : handleNext}
            disabled={submitting}
          >
            {currentQuestionIndex === examData.questions.length - 1 ? (
              <>
                <Flag className="w-4 h-4 mr-2" />
                Submit Exam
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
}