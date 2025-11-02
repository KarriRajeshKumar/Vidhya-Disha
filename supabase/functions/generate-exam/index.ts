// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { examId, userId } = await req.json();
    if (!examId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing examId or userId' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_ANON_KEY') || '');

    const { data: exam, error: examError } = await supabaseClient.from('exams').select('*').eq('id', examId).single();
    if (examError || !exam) return new Response(JSON.stringify({ error: 'Exam not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { data: session, error: sessionError } = await supabaseClient.from('exam_sessions').insert({
      user_id: userId,
      exam_id: examId,
      started_at: new Date().toISOString(),
      status: 'in_progress',
      is_practice: false
    }).select().single();
    if (sessionError) return new Response(JSON.stringify({ error: 'Failed to create session' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) return new Response(JSON.stringify({ error: 'Gemini API key not configured' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const prompt = `Generate ${exam.total_questions} multiple choice questions for a ${exam.subject} exam at ${exam.difficulty} difficulty. Each question should have 4 options (A, B, C, D) with one correct answer. Format as JSON:
[{"question":"...","options":["A) ...","B) ...","C) ...","D) ..."],"correctAnswer":0}]`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!geminiResponse.ok) return new Response(JSON.stringify({ error: 'Failed to generate questions' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const geminiData = await geminiResponse.json();
    const generatedText = geminiData.candidates[0].content.parts[0].text;

    let questions: Question[] = [];
    try {
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON found');
      questions = JSON.parse(jsonMatch[0]).map((q: any, index: number) => ({ ...q, id: `${session.id}-q${index + 1}` }));
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', generatedText);
      return new Response(JSON.stringify({ error: 'Failed to parse generated questions' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ sessionId: session.id, questions, exam }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Error in generate-exam function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
