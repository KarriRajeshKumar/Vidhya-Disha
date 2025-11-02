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

    const { careerId, userId } = await req.json();

    // Get user profile
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!userProfile) {
      throw new Error('User profile not found');
    }

    // Get career details (using the detailed data from CareerDetail.tsx)
    const careerData: Record<string, any> = {
      '1': {
        title: 'Software Engineer',
        description: 'A software engineer designs, develops, and maintains software applications and systems.',
        category: 'technology',
        salaryRange: '₹3,00,000 - ₹12,00,000 per year',
        marketDemand: 'High',
        workLifeBalance: 'Good',
        jobSecurity: 'High',
        educationRequirements: ['Computer Science', 'Software Engineering', 'Information Technology'],
        typicalDuration: '4 years Bachelor\'s degree or equivalent experience',
        careerRoadmap: [
          { stage: '12th Science', description: 'Complete 12th with Physics, Chemistry, and Mathematics', duration: '2 years' },
          { stage: 'B.Tech (CS/IT)', description: 'Pursue Bachelor\'s in Computer Science or Information Technology', duration: '4 years' },
          { stage: 'Entry-Level Developer', description: 'Start as Junior Software Developer or Intern', duration: '1-2 years' },
          { stage: 'Mid-Level Engineer', description: 'Become Software Engineer or Senior Developer', duration: '2-3 years' },
          { stage: 'Senior Engineer/Manager', description: 'Lead technical teams or become Engineering Manager', duration: '3-5 years' }
        ]
      },
      '2': {
        title: 'Chartered Accountant',
        description: 'A Chartered Accountant provides financial advice, auditing services, and tax consulting.',
        category: 'finance',
        salaryRange: '₹5,00,000 - ₹20,00,000 per year',
        marketDemand: 'High',
        workLifeBalance: 'Challenging',
        jobSecurity: 'High',
        educationRequirements: ['Commerce with Accounting', 'CA Foundation', 'CA Intermediate & Final'],
        typicalDuration: '5-6 years including articleship',
        careerRoadmap: [
          { stage: '12th Commerce', description: 'Complete 12th with Commerce stream', duration: '2 years' },
          { stage: 'CA Foundation', description: 'Clear CA Foundation examination', duration: '1 year' },
          { stage: 'CA Intermediate', description: 'Complete CA Intermediate & Articleship', duration: '3 years' },
          { stage: 'CA Final', description: 'Clear CA Final examination', duration: '1 year' },
          { stage: 'Chartered Accountant', description: 'Practice as qualified CA or join firms', duration: 'Career' }
        ]
      },
      '3': {
        title: 'Doctor',
        description: 'A doctor diagnoses, treats, and prevents diseases and injuries.',
        category: 'healthcare',
        salaryRange: '₹6,00,000 - ₹25,00,000 per year',
        marketDemand: 'High',
        workLifeBalance: 'Challenging',
        jobSecurity: 'High',
        educationRequirements: ['MBBS', 'Medical Entrance Exams (NEET)', 'Specialization (MD/MS)'],
        typicalDuration: '5.5 years MBBS + 1 year internship + 3 years specialization',
        careerRoadmap: [
          { stage: '12th Science', description: 'Complete 12th with Biology, Physics, Chemistry', duration: '2 years' },
          { stage: 'NEET & MBBS', description: 'Clear NEET and pursue MBBS', duration: '5.5 years' },
          { stage: 'Internship', description: 'Complete mandatory internship', duration: '1 year' },
          { stage: 'Practice/Specialization', description: 'Start practice or pursue MD/MS', duration: '3+ years' },
          { stage: 'Senior Doctor', description: 'Become senior consultant or lead teams', duration: '5+ years' }
        ]
      },
      '4': {
        title: 'UX/UI Designer',
        description: 'Create user-friendly and visually appealing digital interfaces.',
        category: 'design',
        salaryRange: '₹4,00,000 - ₹15,00,000 per year',
        marketDemand: 'High',
        workLifeBalance: 'Excellent',
        jobSecurity: 'Medium',
        educationRequirements: ['Design degree', 'Portfolio', 'UX/UI certifications'],
        typicalDuration: '3-4 years degree + portfolio development',
        careerRoadmap: [
          { stage: 'Learn Design Basics', description: 'Study design principles, tools, psychology', duration: '6-12 months' },
          { stage: 'Build Portfolio', description: 'Create projects and build portfolio', duration: '6-12 months' },
          { stage: 'Junior Designer', description: 'Start as Junior UX/UI Designer', duration: '1-2 years' },
          { stage: 'Mid-Level Designer', description: 'Work on complex projects', duration: '2-3 years' },
          { stage: 'Senior Designer/Lead', description: 'Lead design teams or become Manager', duration: '3+ years' }
        ]
      },
      '5': {
        title: 'Data Scientist',
        description: 'Analyze data to help organizations make decisions using statistics and ML.',
        category: 'technology',
        salaryRange: '₹5,00,000 - ₹18,00,000 per year',
        marketDemand: 'Very High',
        workLifeBalance: 'Good',
        jobSecurity: 'High',
        educationRequirements: ['Statistics/Math/CS degree', 'Data Science certifications', 'Python/R skills'],
        typicalDuration: '4 years degree + certifications + experience',
        careerRoadmap: [
          { stage: '12th Science/Math', description: 'Complete 12th with Mathematics and Science', duration: '2 years' },
          { stage: 'STEM Degree', description: 'Pursue Statistics, Math, CS, or related', duration: '4 years' },
          { stage: 'Data Analyst', description: 'Start as Data Analyst or Junior Scientist', duration: '1-2 years' },
          { stage: 'Data Scientist', description: 'Work on ML models and analytics', duration: '2-3 years' },
          { stage: 'Senior/Lead Data Scientist', description: 'Lead teams and strategic initiatives', duration: '3+ years' }
        ]
      },
      '6': {
        title: 'Marketing Manager',
        description: 'Develop and execute marketing strategies to promote products.',
        category: 'business',
        salaryRange: '₹4,00,000 - ₹16,00,000 per year',
        marketDemand: 'High',
        workLifeBalance: 'Good',
        jobSecurity: 'Medium',
        educationRequirements: ['Marketing/Business degree', 'Digital marketing certs', 'MBA preferred'],
        typicalDuration: '3-4 years degree + 2-5 years experience',
        careerRoadmap: [
          { stage: '12th Any Stream', description: 'Complete 12th in any stream', duration: '2 years' },
          { stage: 'Marketing Degree', description: 'Pursue BBA/BCom in Marketing', duration: '3-4 years' },
          { stage: 'Marketing Executive', description: 'Start as Marketing Executive', duration: '1-2 years' },
          { stage: 'Marketing Manager', description: 'Lead campaigns and teams', duration: '3-5 years' },
          { stage: 'Senior Manager/Director', description: 'Head departments or become CMO', duration: '5+ years' }
        ]
      }
    };

    const career = careerData[careerId];
    if (!career) {
      throw new Error('Career not found');
    }

    const prompt = `Generate a comprehensive career roadmap for ${career.title} based on the user's profile. Include:

User Profile:
- Education Level: ${userProfile.education_level || 'Not specified'}
- Skills: ${userProfile.skills?.join(', ') || 'None specified'}
- Interests: ${userProfile.interests?.join(', ') || 'None specified'}
- Bio: ${userProfile.bio || 'Not provided'}

Career Details:
- Title: ${career.title}
- Description: ${career.description}
- Category: ${career.category}
- Salary Range: ${career.salaryRange}
- Market Demand: ${career.marketDemand}
- Work-Life Balance: ${career.workLifeBalance}
- Job Security: ${career.jobSecurity}
- Education Requirements: ${career.educationRequirements.join(', ')}
- Typical Duration: ${career.typicalDuration}

Please provide a detailed response in JSON format with the following structure:
{
  "careerTitle": "${career.title}",
  "personalizedRoadmap": "Detailed step-by-step roadmap based on user's current level",
  "syllabus": [
    {
      "phase": "Foundation Phase",
      "subjects": ["Subject 1", "Subject 2"],
      "duration": "6 months",
      "resources": ["Resource 1", "Resource 2"]
    }
  ],
  "advantages": ["Advantage 1", "Advantage 2", "Advantage 3"],
  "disadvantages": ["Disadvantage 1", "Disadvantage 2"],
  "careerPath": [
    {
      "stage": "Entry Level",
      "description": "Description",
      "salary": "₹X - ₹Y",
      "duration": "X years",
      "requirements": ["Req 1", "Req 2"]
    }
  ],
  "suggestedResources": [
    {
      "type": "Books",
      "items": ["Book 1", "Book 2"]
    },
    {
      "type": "Courses",
      "items": ["Course 1", "Course 2"]
    },
    {
      "type": "Websites",
      "items": ["Website 1", "Website 2"]
    }
  ],
  "nextSteps": ["Step 1", "Step 2", "Step 3"]
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
          maxOutputTokens: 4096,
        }
      }),
    });

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Try to parse as JSON, fallback to default structure
    let roadmap;
    try {
      // Clean the response by removing markdown code blocks if present
      const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
      roadmap = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      roadmap = {
        careerTitle: career.title,
        personalizedRoadmap: `Start your journey in ${career.title} with foundational learning and gradually progress through advanced topics.`,
        syllabus: [
          {
            phase: "Foundation",
            subjects: ["Basic concepts", "Fundamental skills"],
            duration: "3-6 months",
            resources: ["Online tutorials", "Beginner courses"]
          }
        ],
        advantages: ["Good salary potential", "High demand", "Career growth"],
        disadvantages: ["Learning curve", "Competition", "Continuous learning required"],
        careerPath: career.careerRoadmap.map((stage: any) => ({
          stage: stage.stage,
          description: stage.description,
          salary: career.salaryRange,
          duration: stage.duration,
          requirements: ["Relevant education", "Skills development"]
        })),
        suggestedResources: [
          {
            type: "Courses",
            items: ["Coursera courses", "Udemy tutorials"]
          },
          {
            type: "Books",
            items: ["Relevant textbooks", "Industry guides"]
          }
        ],
        nextSteps: [
          "Assess your current skills",
          "Start with foundational courses",
          "Build a portfolio",
          "Network with professionals"
        ]
      };
    }

    return new Response(JSON.stringify(roadmap), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-career-roadmap function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      careerTitle: "Error",
      personalizedRoadmap: "Unable to generate roadmap at this time.",
      syllabus: [],
      advantages: [],
      disadvantages: [],
      careerPath: [],
      suggestedResources: [],
      nextSteps: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});