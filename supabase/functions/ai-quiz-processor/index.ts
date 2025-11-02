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
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!geminiApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { answers, userId } = await req.json();

    console.log('Processing quiz for user:', userId, 'with answers:', answers);

    // Generate session ID
    const sessionId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate profile analysis based on answers
    const profileAnalysis = calculateProfileAnalysis(answers);

    // Generate career recommendations using Gemini AI
    const prompt = `
    Based on the following quiz answers and profile analysis, recommend the top 4 most suitable career paths:

    Profile Analysis:
    - Technical: ${profileAnalysis.technical}%
    - Creative: ${profileAnalysis.creative}%
    - Analytical: ${profileAnalysis.analytical}%
    - Leadership: ${profileAnalysis.leadership}%
    - Communication: ${profileAnalysis.communication}%
    - Regional Impact: ${profileAnalysis.regionalImpact}%

    Quiz Answers: ${JSON.stringify(answers)}

    Please provide exactly 4 career recommendations in the following JSON format:
    {
      "recommendations": [
        {
          "title": "Career Title",
          "description": "Brief description of the career",
          "matchScore": 85,
          "salaryRange": "₹6-15 LPA",
          "marketDemand": "High",
          "workLifeBalance": "Good",
          "jobSecurity": "High",
          "category": "Technology",
          "icon": "💻",
          "profileMatch": {
            "technical": 90,
            "creative": 60,
            "analytical": 85,
            "leadership": 70,
            "communication": 65,
            "regionalImpact": 75
          }
        }
      ]
    }

    Focus on Indian market careers with LPA salary ranges. Categories can be: Technology, Healthcare, Finance, Design, Business, Education.
    `;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const geminiData = await response.json();
    console.log('Gemini response:', geminiData);

    let careerRecommendations;
    try {
      const generatedText = geminiData.candidates[0].content.parts[0].text;
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        careerRecommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      // Fallback recommendations
      careerRecommendations = {
        recommendations: [
          {
            title: "Software Engineer",
            description: "Develop software solutions and applications using programming languages and development tools.",
            matchScore: profileAnalysis.technical,
            salaryRange: "₹6-15 LPA",
            marketDemand: "High",
            workLifeBalance: "Good",
            jobSecurity: "High",
            category: "Technology",
            icon: "💻",
            profileMatch: {
              technical: 95,
              creative: 60,
              analytical: 85,
              leadership: 70,
              communication: 65,
              regionalImpact: 75
            }
          },
          {
            title: "UX/UI Designer",
            description: "Create user-friendly and visually appealing digital interfaces.",
            matchScore: profileAnalysis.creative,
            salaryRange: "₹5-12 LPA",
            marketDemand: "High",
            workLifeBalance: "Excellent",
            jobSecurity: "Medium",
            category: "Design",
            icon: "🎨",
            profileMatch: {
              technical: 70,
              creative: 95,
              analytical: 60,
              leadership: 50,
              communication: 80,
              regionalImpact: 70
            }
          },
          {
            title: "Data Scientist",
            description: "Analyze complex data to help organizations make informed decisions.",
            matchScore: profileAnalysis.analytical,
            salaryRange: "₹8-20 LPA",
            marketDemand: "High",
            workLifeBalance: "Good",
            jobSecurity: "High",
            category: "Technology",
            icon: "📊",
            profileMatch: {
              technical: 90,
              creative: 40,
              analytical: 95,
              leadership: 60,
              communication: 70,
              regionalImpact: 80
            }
          },
          {
            title: "Healthcare Professional",
            description: "Provide medical care and support to patients in various healthcare settings.",
            matchScore: profileAnalysis.regionalImpact,
            salaryRange: "₹8-25 LPA",
            marketDemand: "High",
            workLifeBalance: "Challenging",
            jobSecurity: "High",
            category: "Healthcare",
            icon: "🏥",
            profileMatch: {
              technical: 70,
              creative: 40,
              analytical: 80,
              leadership: 60,
              communication: 90,
              regionalImpact: 95
            }
          }
        ]
      };
    }

    // Save quiz results to database
    const { error } = await supabase
      .from('user_quiz_results')
      .insert([{
        user_id: userId,
        session_id: sessionId,
        answers: answers,
        profile_analysis: profileAnalysis,
        career_recommendations: careerRecommendations
      }]);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    return new Response(JSON.stringify({
      sessionId,
      profileAnalysis,
      careerRecommendations: careerRecommendations.recommendations
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-quiz-processor function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateProfileAnalysis(answers: any[]): any {
  // Initialize scores
  const scores = {
    technical: 0,
    creative: 0,
    analytical: 0,
    leadership: 0,
    communication: 0,
    regionalImpact: 0
  };

  // Analyze each answer and update scores
  answers.forEach((answer, index) => {
    const answerText = answer.toLowerCase();
    
    // Question-based scoring logic
    switch (index) {
      case 0: // Learning environment
        if (answerText.includes('individual')) scores.technical += 20;
        if (answerText.includes('group')) scores.communication += 20;
        if (answerText.includes('interactive')) scores.leadership += 15;
        break;
      case 1: // What energizes you
        if (answerText.includes('solving') || answerText.includes('problems')) scores.technical += 25;
        if (answerText.includes('creating')) scores.creative += 25;
        if (answerText.includes('analyzing')) scores.analytical += 25;
        if (answerText.includes('leading')) scores.leadership += 25;
        break;
      case 2: // Communication preference
        if (answerText.includes('written')) scores.technical += 15;
        if (answerText.includes('visual')) scores.creative += 20;
        if (answerText.includes('face-to-face')) scores.communication += 25;
        break;
      case 3: // Work motivation
        if (answerText.includes('impact') || answerText.includes('society')) scores.regionalImpact += 25;
        if (answerText.includes('financial')) scores.analytical += 15;
        if (answerText.includes('learning')) scores.technical += 15;
        break;
      case 4: // Problem-solving type
        if (answerText.includes('technical')) scores.technical += 25;
        if (answerText.includes('creative')) scores.creative += 25;
        if (answerText.includes('people')) scores.communication += 20;
        if (answerText.includes('strategic')) scores.leadership += 20;
        break;
      case 5: // Work environment
        if (answerText.includes('startup')) scores.leadership += 15;
        if (answerText.includes('corporate')) scores.analytical += 15;
        if (answerText.includes('remote')) scores.technical += 10;
        if (answerText.includes('collaborative')) scores.communication += 20;
        break;
      case 6: // Skills to develop
        if (answerText.includes('programming')) scores.technical += 25;
        if (answerText.includes('design')) scores.creative += 25;
        if (answerText.includes('leadership')) scores.leadership += 25;
        if (answerText.includes('communication')) scores.communication += 25;
        break;
      case 7: // Type of impact
        if (answerText.includes('global')) scores.leadership += 20;
        if (answerText.includes('local') || answerText.includes('community')) scores.regionalImpact += 25;
        if (answerText.includes('innovation')) scores.technical += 20;
        break;
      case 8: // Approach to challenges
        if (answerText.includes('research')) scores.analytical += 20;
        if (answerText.includes('jump') || answerText.includes('doing')) scores.creative += 15;
        if (answerText.includes('collaborate')) scores.communication += 20;
        break;
      case 9: // Technology interest
        if (answerText.includes('building')) scores.technical += 25;
        if (answerText.includes('understanding')) scores.analytical += 20;
        if (answerText.includes('solve')) scores.technical += 15;
        if (answerText.includes('teaching')) scores.communication += 20;
        break;
      case 10: // Career aspect importance
        if (answerText.includes('balance')) scores.creative += 15;
        if (answerText.includes('earning')) scores.analytical += 15;
        if (answerText.includes('security')) scores.technical += 10;
        if (answerText.includes('creativity')) scores.creative += 20;
        break;
      case 11: // Learning preference
        if (answerText.includes('hands-on')) scores.technical += 20;
        if (answerText.includes('structured')) scores.analytical += 15;
        if (answerText.includes('mentorship')) scores.communication += 15;
        break;
    }
  });

  // Normalize scores to percentages (max 100)
  const maxPossibleScore = 25 * 12; // Approximate max score per category
  Object.keys(scores).forEach(key => {
    scores[key] = Math.min(Math.round((scores[key] / maxPossibleScore) * 100), 100);
    // Ensure minimum of 30% for variety
    scores[key] = Math.max(scores[key], 30);
  });

  return scores;
}