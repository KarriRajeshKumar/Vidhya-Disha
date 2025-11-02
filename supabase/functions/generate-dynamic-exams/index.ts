// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Exam {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: string;
  duration_minutes: number;
  total_questions: number;
  passing_score: number;
  exam_type: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || ''
    );

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('interests')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userInterests: string[] = profile.interests || [];

    if (!userInterests.length) {
      // Fallback: return a small curated set of default exams when no interests are present
      const defaultExams: Exam[] = [
        {
          id: `default-exam-basics-1`,
          title: 'General Programming Fundamentals',
          description: 'Basics of programming, algorithms, and data structures.',
          subject: 'programming',
          difficulty: 'easy',
          duration_minutes: 20,
          total_questions: 10,
          passing_score: 60,
          exam_type: 'default'
        },
        {
          id: `default-exam-web-1`,
          title: 'Web Development Essentials',
          description: 'HTML, CSS, JavaScript basics and web concepts.',
          subject: 'web development',
          difficulty: 'easy',
          duration_minutes: 25,
          total_questions: 12,
          passing_score: 60,
          exam_type: 'default'
        }
      ];

      return new Response(
        JSON.stringify({ exams: defaultExams, userInterests: [], generatedAt: new Date().toISOString() }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const exams: Exam[] = [];

    userInterests.forEach((interest: string) => {
      const interestLower = interest.toLowerCase().trim();

      const examVariations = [
        {
          title: `${interest} Fundamentals`,
          description: `Test your knowledge of ${interest} basics and core concepts.`,
          difficulty: 'easy',
          duration_minutes: 20,
          total_questions: 10,
          passing_score: 60
        },
        {
          title: `Advanced ${interest}`,
          description: `Challenge yourself with advanced ${interest} topics and concepts.`,
          difficulty: 'medium',
          duration_minutes: 30,
          total_questions: 15,
          passing_score: 70
        }
      ];

      examVariations.forEach((variation, index) => {
        exams.push({
          id: `dynamic-exam-${userId}-${interestLower}-${index}`,
          title: variation.title,
          description: variation.description,
          subject: interestLower,
          difficulty: variation.difficulty,
          duration_minutes: variation.duration_minutes,
          total_questions: variation.total_questions,
          passing_score: variation.passing_score,
          exam_type: 'dynamic'
        });
      });
    });

    return new Response(
      JSON.stringify({
        exams,
        userInterests,
        generatedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-dynamic-exams function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
