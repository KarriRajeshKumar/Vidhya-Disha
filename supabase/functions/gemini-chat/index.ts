import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { message, userId } = await req.json();

    // Get user profile for personalized responses
    let userProfile = null;
    if (userId) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      userProfile = data;
    }

    // Create personalized system prompt based on user profile
    let systemPrompt = `You are an AI Career Mentor for a career development platform. Provide CONCISE, helpful career advice.

RESPONSE GUIDELINES:
- Keep responses SHORT (2-4 sentences max)
- Use bullet points for lists (max 3-4 items)
- Be specific and actionable
- Avoid long paragraphs
- Focus on practical next steps`;

    if (userProfile) {
      systemPrompt += `\n\nUser Profile:
      - Name: ${userProfile.display_name || 'User'}
      - Experience Level: ${userProfile.experience_level}
      - Current Role: ${userProfile.role_title || 'Not specified'}
      - Skills: ${userProfile.skills?.join(', ') || 'None specified'}
      - Interests: ${userProfile.interests?.join(', ') || 'None specified'}
      
      Provide brief, actionable career advice. Keep it conversational but concise.`;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `User Question: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      throw new Error(data.error?.message || 'Failed to get response from Gemini');
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I cannot provide a response at this time.';

    return new Response(JSON.stringify({ 
      response: generatedText,
      userProfile: userProfile 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});