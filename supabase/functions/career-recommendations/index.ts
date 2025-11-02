import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    const { userId } = await req.json();

    // Get user profile
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!userProfile) {
      throw new Error('User profile not found');
    }

    // Get available career paths
    const { data: careerPaths } = await supabase
      .from('career_paths')
      .select('*');

    const prompt = `Based on the user's profile, recommend the top 3 most suitable career paths and explain why each is a good fit:

User Profile:
- Experience Level: ${userProfile.experience_level}
- Current Role: ${userProfile.role_title || 'Not specified'}
- Skills: ${userProfile.skills?.join(', ') || 'None specified'}
- Interests: ${userProfile.interests?.join(', ') || 'None specified'}

Available Career Paths:
${careerPaths?.map(path => `- ${path.title}: ${path.description} (${path.difficulty} level, ${path.duration})`).join('\n')}

Format your response as JSON with this structure:
{
  "recommendations": [
    {
      "pathTitle": "Career Path Name",
      "matchPercentage": 85,
      "reasoning": "Why this path fits the user",
      "nextSteps": "Immediate actions to take"
    }
  ]
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    // Try to parse as JSON, fallback to default structure
    let recommendations;
    try {
      recommendations = JSON.parse(generatedText);
    } catch {
      recommendations = {
        recommendations: [
          {
            pathTitle: "Web Development",
            matchPercentage: 75,
            reasoning: "Good starting point for most backgrounds",
            nextSteps: "Start with HTML, CSS, and JavaScript basics"
          }
        ]
      };
    }

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in career-recommendations function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      recommendations: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});