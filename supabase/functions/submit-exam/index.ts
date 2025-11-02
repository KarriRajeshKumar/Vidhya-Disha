// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { sessionId, answers, score, correctAnswers, totalQuestions, timeTakenMinutes } = await req.json();
    if (!sessionId) return new Response(JSON.stringify({ error: 'Missing sessionId' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_ANON_KEY') || '');

    const { error: sessionError } = await supabaseClient.from('exam_sessions').update({
      completed_at: new Date().toISOString(),
      status: 'completed'
    }).eq('id', sessionId);
    if (sessionError) return new Response(JSON.stringify({ error: 'Failed to update session' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { data: session, error: sessionFetchError } = await supabaseClient.from('exam_sessions').select('user_id, exam_id').eq('id', sessionId).single();
    if (sessionFetchError || !session) return new Response(JSON.stringify({ error: 'Session not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { error: resultError } = await supabaseClient.from('user_exam_results').insert({
      user_id: session.user_id,
      exam_id: session.exam_id,
      score,
      correct_answers: correctAnswers,
      total_questions: totalQuestions,
      time_taken_minutes: timeTakenMinutes,
      completed_at: new Date().toISOString(),
      is_practice: false
    });
    if (resultError) return new Response(JSON.stringify({ error: 'Failed to save results' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    // Generate improvement suggestions
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    let suggestions = 'Unable to generate suggestions at this time.';

    if (geminiApiKey) {
      try {
        const prompt = `User scored ${score}% (${correctAnswers}/${totalQuestions}). Provide concise, actionable improvement suggestions based on the performance.`;
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          suggestions = geminiData.candidates[0].content.parts[0].text;
        }
      } catch (geminiError) {
        console.error('Failed to generate suggestions:', geminiError);
      }
    }

    return new Response(JSON.stringify({ success: true, score, correctAnswers, totalQuestions, suggestions }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Error in submit-exam function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
