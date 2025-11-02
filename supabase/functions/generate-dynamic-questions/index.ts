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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, interest, questionCount = 10, difficulty = 'medium' } = await req.json();

    if (!userId || !interest) {
      return new Response(
        JSON.stringify({ error: 'Missing userId or interest' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `Generate ${questionCount} unique multiple choice questions about "${interest}". Each question should have exactly 4 options (A, B, C, D) with one correct answer. Make them appropriate for ${difficulty} difficulty level. Format as JSON array:
[
  {
    "question": "Question text?",
    "options": ["A) Option1", "B) Option2", "C) Option3", "D) Option4"],
    "correctAnswer": 0
  }
]
Ensure correctAnswer is the index (0-3) of the correct option. Avoid repeating similar questions.`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 2048 }
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to generate questions from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const geminiData = await geminiResponse.json();
    const generatedText = geminiData.candidates[0].content.parts[0].text;

    let questions: Question[] = [];
    try {
      const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No JSON found in AI response');

      questions = JSON.parse(jsonMatch[0])
        .filter((q: any) => q.question && Array.isArray(q.options) && q.options.length === 4 && typeof q.correctAnswer === 'number')
        .slice(0, questionCount)
        .map((q: any, index: number) => ({
          id: `q-${userId}-${Date.now()}-${index}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        }));

      if (!questions.length) throw new Error('No valid questions generated');

    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedText);
      return new Response(
        JSON.stringify({ error: 'Failed to parse generated questions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ questions, interest, generatedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-dynamic-questions function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
