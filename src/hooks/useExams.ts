import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';
import { Tables } from '@/integrations/supabase/types';

type Exam = Tables<'exams'>;
type ExamResult = Tables<'user_exam_results'>;

export const useExams = () => {
  const { profile } = useProfile();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      if (!profile?.user_id) {
        setLoading(false);
        return;
      }

      try {
        // Try to call Supabase function for dynamic exam generation
        const { data, error } = await supabase.functions.invoke('generate-dynamic-exams', {
          body: { userId: profile.user_id }
        });

        if (!error && data && Array.isArray(data.exams)) {
          // Convert the dynamic exam format to match the Exam type
          const formattedExams: Exam[] = data.exams.map((exam: any) => ({
            id: exam.id,
            title: exam.title,
            description: exam.description,
            subject: exam.subject,
            difficulty: exam.difficulty,
            duration_minutes: exam.duration_minutes,
            total_questions: exam.total_questions,
            passing_score: exam.passing_score,
            exam_type: exam.exam_type,
            created_at: new Date().toISOString()
          }));

          setExams(formattedExams);
          setError(null);
          setLoading(false);
          return;
        }

        // Fallback: Generate exams client-side based on user interests
        console.warn('Supabase function not available, generating exams client-side');

        const userInterests: string[] = profile.interests || [];

        if (userInterests.length > 0) {
          const dynamicExams: Exam[] = [];

          userInterests.forEach((interest: string) => {
            const interestLower = interest.toLowerCase().trim();

            const examVariations = [
              {
                title: `${interest} Fundamentals`,
                description: `Test your knowledge of ${interest} basics and core concepts.`,
                difficulty: 'easy' as const,
                duration_minutes: 20,
                total_questions: 10,
                passing_score: 60
              },
              {
                title: `Advanced ${interest}`,
                description: `Challenge yourself with advanced ${interest} topics and concepts.`,
                difficulty: 'medium' as const,
                duration_minutes: 30,
                total_questions: 15,
                passing_score: 70
              }
            ];

            examVariations.forEach((variation, index) => {
              dynamicExams.push({
                id: `dynamic_exam_${profile.user_id}_${interestLower}_${index}`,
                title: variation.title,
                description: variation.description,
                subject: interestLower,
                difficulty: variation.difficulty,
                duration_minutes: variation.duration_minutes,
                total_questions: variation.total_questions,
                passing_score: variation.passing_score,
                exam_type: 'dynamic',
                created_at: new Date().toISOString()
              });
            });
          });

          setExams(dynamicExams);
          setError(null);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Dynamic exam generation failed, using fallback exams:', err);
      }

      // Fallback to default exams when API fails or is not available
      const defaultExams: Exam[] = [
        {
          id: 'default-1',
          title: 'General Programming Fundamentals',
          description: 'Basics of programming, algorithms, and data structures.',
          subject: 'programming',
          difficulty: 'easy',
          duration_minutes: 20,
          total_questions: 10,
          passing_score: 60,
          exam_type: 'static',
          created_at: new Date().toISOString()
        },
        {
          id: 'default-2',
          title: 'Web Development Essentials',
          description: 'HTML, CSS, JavaScript basics and web concepts.',
          subject: 'web',
          difficulty: 'easy',
          duration_minutes: 25,
          total_questions: 12,
          passing_score: 60,
          exam_type: 'static',
          created_at: new Date().toISOString()
        }
      ];

      setExams(defaultExams);
      setError(null);
      setLoading(false);
    };

    fetchExams();
  }, [profile?.user_id]);

  return { exams, loading, error };
};

export const useExamHistory = (userId?: string) => {
  const [history, setHistory] = useState<(ExamResult & { exams?: Tables<'exams'> })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const { data: results, error } = await supabase
          .from('user_exam_results')
          .select('*')
          .eq('user_id', userId)
          .order('completed_at', { ascending: false });

        if (error) throw error;

        // Fetch exam details for each result
        const historyWithExams = await Promise.all(
          (results || []).map(async (result) => {
            let exam;

            if (result.exam_id.startsWith('dynamic_exam_')) {
              // Parse dynamic exam details from ID
              const parts = result.exam_id.split('_');
              if (parts.length >= 5) {
                const interest = parts[3];
                const difficultyIndex = parseInt(parts[4]);

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
                  id: result.exam_id,
                  ...examVariations[difficultyIndex] || examVariations[0]
                };
              }
            } else {
              // Get from database for static exams
              const { data: examData } = await supabase
                .from('exams')
                .select('*')
                .eq('id', result.exam_id)
                .single();

              exam = examData;
            }

            return { ...result, exams: exam };
          })
        );

        setHistory(historyWithExams);
      } catch (err) {
        console.error('Failed to fetch exam history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  return { history, loading };
};