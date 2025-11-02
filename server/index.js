require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for updates (fallback until database tables are created)
const updatesStorage = {
  aiTools: [],
  jobs: [],
  internships: [],
  scholarships: [],
  documents: []
};

// Load data from file if it exists
const fs = require('fs');
const path = require('path');
const storageFile = path.join(__dirname, 'updates-storage.json');

try {
  if (fs.existsSync(storageFile)) {
    const data = fs.readFileSync(storageFile, 'utf8');
    Object.assign(updatesStorage, JSON.parse(data));
    console.log('Loaded updates storage from file');
  }
} catch (error) {
  console.warn('Failed to load updates storage from file:', error.message);
}

// Save data to file
const saveStorageToFile = () => {
  try {
    fs.writeFileSync(storageFile, JSON.stringify(updatesStorage, null, 2));
  } catch (error) {
    console.warn('Failed to save updates storage to file:', error.message);
  }
};

const PORT = process.env.PORT || 4000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Helper to call Gemini API - expects a structured prompt and returns parsed JSON
async function generateQuestionsWithGemini(prompt, numQuestions = 10) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not configured');

  const body = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 2048,
    }
  };

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error('Gemini API error: ' + text);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Try to extract JSON array from response
  let arr;
  try {
    // First try to parse the entire response as JSON
    arr = JSON.parse(text);
  } catch (e) {
    // If that fails, try to extract JSON array
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('No JSON array found in Gemini response, using fallback questions');
      return generateFallbackQuestions(numQuestions);
    }
    arr = JSON.parse(jsonMatch[0]);
  }

  // Validate and format questions
  if (!Array.isArray(arr)) {
    console.warn('Gemini response is not an array, using fallback questions');
    return generateFallbackQuestions(numQuestions);
  }

  return arr.slice(0, numQuestions).map((q, idx) => ({
    id: `q-${uuidv4()}`,
    question_text: q.question || q.prompt || q.text || `Question ${idx + 1}`,
    choices: Array.isArray(q.options) ? q.options : (Array.isArray(q.choices) ? q.choices : []),
    correct_index: typeof q.correctAnswer === 'number' ? q.correctAnswer : (typeof q.correct_index === 'number' ? q.correct_index : 0)
  }));
}

// Fallback question generator for when Gemini fails
function generateFallbackQuestions(numQuestions = 10) {
  const fallbackQuestions = [
    {
      id: `q-${uuidv4()}`,
      question_text: "What is the primary purpose of a function in programming?",
      choices: ["A) To store data", "B) To perform a specific task", "C) To display output", "D) To declare variables"],
      correct_index: 1
    },
    {
      id: `q-${uuidv4()}`,
      question_text: "Which data structure follows Last In First Out (LIFO) principle?",
      choices: ["A) Queue", "B) Stack", "C) Array", "D) Linked List"],
      correct_index: 1
    },
    {
      id: `q-${uuidv4()}`,
      question_text: "What does HTML stand for?",
      choices: ["A) HyperText Markup Language", "B) High Tech Modern Language", "C) Home Tool Markup Language", "D) Hyper Transfer Markup Language"],
      correct_index: 0
    },
    {
      id: `q-${uuidv4()}`,
      question_text: "Which HTTP method is used to retrieve data from a server?",
      choices: ["A) POST", "B) PUT", "C) GET", "D) DELETE"],
      correct_index: 2
    },
    {
      id: `q-${uuidv4()}`,
      question_text: "What is the purpose of CSS in web development?",
      choices: ["A) To add interactivity", "B) To style the appearance", "C) To store data", "D) To handle server requests"],
      correct_index: 1
    }
  ];

  // Return requested number of questions, cycling through available ones
  const questions = [];
  for (let i = 0; i < numQuestions; i++) {
    const question = fallbackQuestions[i % fallbackQuestions.length];
    questions.push({
      ...question,
      id: `q-${uuidv4()}` // Generate new ID for each instance
    });
  }

  return questions;
}

// GET /api/exams - returns exams filtered by user interests (userId in query)
app.get('/api/exams', async (req, res) => {
  const userId = req.query.userId;
  const interestsParam = req.query.interests;
  try {
    // Parse interests from query param if provided (accepts JSON array or comma-separated)
    let interests = null;
    if (interestsParam) {
      try {
        interests = JSON.parse(interestsParam);
      } catch (e) {
        interests = String(interestsParam).split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    // If no interests provided in query, fetch from user profile
    if (!interests && userId) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('interests')
        .eq('user_id', userId)
        .single();

      if (!error && profile?.interests) {
        interests = Array.isArray(profile.interests) ? profile.interests : String(profile.interests).split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    // If still no interests, return empty array
    if (!interests || (Array.isArray(interests) && interests.length === 0)) {
      return res.json({ exams: [], userInterests: [] });
    }

    // Normalize interests to array of strings
    if (!Array.isArray(interests)) interests = [String(interests)];

    // Build dynamic exams list based on user interests
    const exams = [];
    interests.forEach((interest) => {
      const slug = String(interest).toLowerCase().replace(/[^a-z0-9]+/g, '_');
      // Generate exam IDs in the format: dynamic_exam_{userId}_{interest}_{index}
      exams.push({
        id: `dynamic_exam_${userId}_${slug}_0`,
        title: `${interest.charAt(0).toUpperCase() + interest.slice(1)} Fundamentals`,
        subject: interest,
        difficulty: 'easy',
        total_questions: 10,
        duration_minutes: 20,
        passing_score: 60,
        exam_type: 'dynamic'
      });
      exams.push({
        id: `dynamic_exam_${userId}_${slug}_1`,
        title: `Advanced ${interest.charAt(0).toUpperCase() + interest.slice(1)}`,
        subject: interest,
        difficulty: 'medium',
        total_questions: 15,
        duration_minutes: 30,
        passing_score: 70,
        exam_type: 'dynamic'
      });
    });

    res.json({ exams, userInterests: interests });
  } catch (err) {
    console.error('Error fetching exams:', err);
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
});

// POST /api/submit - submit answers, store results, return suggestions from Gemini
app.post('/api/submit', async (req, res) => {
  const { userId, examId, answers, timeTakenMinutes } = req.body;
  if (!userId || !examId || !answers) return res.status(400).json({ error: 'Missing parameters' });

  try {
    // Calculate score from answers
    let correct = 0;
    const total = answers.length;

    // For now, we'll assume answers contain the correct answer info
    // In a real implementation, you'd fetch the correct answers from storage
    answers.forEach(answer => {
      if (answer.isCorrect !== undefined) {
        if (answer.isCorrect) correct++;
      }
    });

    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    // Store result in Supabase
    let resultId = uuidv4();
    try {
      const { data: result, error: insertError } = await supabase
        .from('user_exam_results')
        .insert({
          user_id: userId,
          exam_id: examId,
          score,
          correct_answers: correct,
          total_questions: total,
          time_taken_minutes: timeTakenMinutes || 0,
          completed_at: new Date().toISOString(),
          is_practice: false
        })
        .select()
        .single();

      if (insertError) {
        console.warn('Supabase result insertion failed, using generated ID:', insertError);
      } else if (result) {
        resultId = result.id;
      }
    } catch (dbError) {
      console.warn('Database result insertion failed, using generated ID:', dbError);
    }

    // Update session status to completed if session exists
    try {
      await supabase
        .from('exam_sessions')
        .update({ status: 'completed' })
        .eq('user_id', userId)
        .eq('exam_id', examId);
    } catch (sessionError) {
      console.warn('Failed to update session status:', sessionError);
    }

    // Ask Gemini for personalized suggestions
    const prompt = `User scored ${score}% on a ${examId} exam with ${total} questions. They got ${correct} correct. Provide concise, personalized improvement suggestions and topics to study for better performance.`;

    let suggestions = '';
    try {
      const gen = await generateQuestionsWithGemini(prompt, 1);
      suggestions = gen[0]?.question_text || 'Focus on reviewing the fundamental concepts and practice regularly.';
    } catch (gerr) {
      console.warn('Gemini suggestions failed', gerr);
      suggestions = 'Focus on reviewing the fundamental concepts and practice regularly.';
    }

    res.json({
      success: true,
      score,
      total,
      correct,
      suggestions,
      resultId
    });
  } catch (err) {
    console.error('Error submitting exam:', err);
    res.status(500).json({ error: 'Failed to submit results' });
  }
});

// GET /api/history - returns user exam history
app.get('/api/history', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const { data: history, error } = await supabase
      .from('user_exam_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching history:', error);
      return res.status(500).json({ error: 'Failed to fetch history' });
    }

    res.json({ history: history || [] });
  } catch (err) {
    console.error('Error in history endpoint:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// GET /api/updates - get all updates (AI tools, jobs, internships, scholarships)
app.get('/api/updates', async (req, res) => {
  try {
    // Return from in-memory storage
    const updates = {
      aiTools: updatesStorage.aiTools || [],
      jobs: updatesStorage.jobs || [],
      internships: updatesStorage.internships || [],
      scholarships: updatesStorage.scholarships || [],
      documents: updatesStorage.documents || []
    };

    res.json(updates);
  } catch (err) {
    console.error('Error fetching updates:', err);
    res.status(500).json({ error: 'Failed to fetch updates' });
  }
});

// POST /api/updates - add new update
app.post('/api/updates', async (req, res) => {
  const { category, userId, ...formData } = req.body;

  if (!category || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const tableName = category === 'aiTools' ? 'ai_tools' :
                      category === 'jobs' ? 'jobs' :
                      category === 'internships' ? 'internships' : 'scholarships';

    let data;
    let error = null;

    // Prepare data based on category
    if (category === 'aiTools') {
      if (!formData.title || !formData.description || !formData.link) {
        return res.status(400).json({ error: 'Missing required fields for AI Tools' });
      }
      data = {
        title: formData.title,
        description: formData.description,
        link: formData.link,
        category: formData.toolCategory || null,
        pricing: formData.pricing || null,
        user_id: userId
      };
    } else if (category === 'jobs') {
      if (!formData.title || !formData.company_name || !formData.location || !formData.job_type || !formData.application_link || !formData.description) {
        return res.status(400).json({ error: 'Missing required fields for Jobs' });
      }
      data = {
        title: formData.title,
        company_name: formData.company_name,
        location: formData.location,
        job_type: formData.job_type,
        salary: formData.salary || null,
        application_link: formData.application_link,
        description: formData.description,
        user_id: userId
      };
    } else if (category === 'internships') {
      if (!formData.title || !formData.company_organization || !formData.duration || !formData.location || !formData.application_deadline || !formData.application_link || !formData.description) {
        return res.status(400).json({ error: 'Missing required fields for Internships' });
      }
      data = {
        title: formData.title,
        company_organization: formData.company_organization,
        duration: formData.duration,
        location: formData.location,
        stipend: formData.stipend || null,
        application_deadline: formData.application_deadline,
        application_link: formData.application_link,
        description: formData.description,
        user_id: userId
      };
    } else if (category === 'scholarships') {
      if (!formData.title || !formData.provider_organization || !formData.eligibility || !formData.deadline || !formData.amount_benefits || !formData.application_link || !formData.description) {
        return res.status(400).json({ error: 'Missing required fields for Scholarships' });
      }
      data = {
        title: formData.title,
        provider_organization: formData.provider_organization,
        eligibility: formData.eligibility,
        deadline: formData.deadline,
        amount_benefits: formData.amount_benefits,
        application_link: formData.application_link,
        description: formData.description,
        user_id: userId
      };
    } else if (category === 'documents') {
      if (!formData.title || !formData.link) {
        return res.status(400).json({ error: 'Missing required fields for Documents' });
      }
      data = {
        title: formData.title,
        link: formData.link,
        document: formData.document || null,
        user_id: userId
      };
    } else {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Store in in-memory storage for fallback
    const memoryData = {
      id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
      // Include additional fields based on category
      ...(category === 'aiTools' && {
        category: formData.toolCategory,
        pricing: formData.pricing
      }),
      ...(category === 'jobs' && {
        company_name: formData.company_name,
        location: formData.location,
        job_type: formData.job_type,
        salary: formData.salary
      }),
      ...(category === 'internships' && {
        company_organization: formData.company_organization,
        duration: formData.duration,
        location: formData.location,
        stipend: formData.stipend,
        application_deadline: formData.application_deadline
      }),
      ...(category === 'scholarships' && {
        provider_organization: formData.provider_organization,
        eligibility: formData.eligibility,
        deadline: formData.deadline,
        amount_benefits: formData.amount_benefits
      }),
      ...(category === 'documents' && {
        link: formData.link,
        document: formData.document
      })
    };

    if (updatesStorage[category]) {
      updatesStorage[category].push(memoryData);
      saveStorageToFile(); // Save to file
    }

    // Try to insert into database
    let dbSuccess = false;
    try {
      console.log('Attempting to insert into table:', tableName);
      const result = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();

      console.log('Supabase result:', { data: result.data, error: result.error });
      if (result.error) {
        console.warn('Database insertion failed, using fallback storage:', result.error.message);
      } else {
        data = result.data;
        dbSuccess = true;
      }
    } catch (dbError) {
      console.warn('Database error, using fallback storage:', dbError.message);
    }

    // Use in-memory storage if database failed
    if (!dbSuccess) {
      data = memoryData;
      console.log('Using in-memory storage for:', category);
    }

    // Create notification for all users (only if notifications table exists)
    try {
      const { data: users } = await supabase
        .from('profiles')
        .select('user_id')
        .neq('user_id', userId);

      if (users && users.length > 0) {
        const notifications = users.map(user => ({
          user_id: user.user_id,
          type: 'new_update',
          title: `New ${category.replace(/([A-Z])/g, ' $1').toLowerCase()} added`,
          message: `"${formData.title}" has been added to ${category.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          read: false,
          created_at: new Date().toISOString()
        }));

        await supabase.from('notifications').insert(notifications);
      }
    } catch (notifError) {
      console.warn('Notifications table not available:', notifError.message);
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error('Error in updates endpoint:', err);
    res.status(500).json({ error: 'Failed to add update' });
  }
});

// GET /api/notifications - get user notifications
app.get('/api/notifications', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    let notifications = [];
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.warn('Notifications table not available:', error.message);
      } else {
        notifications = data || [];
      }
    } catch (tableError) {
      console.warn('Notifications table not found:', tableError.message);
    }

    res.json({ notifications });
  } catch (err) {
    console.error('Error in notifications endpoint:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// PUT /api/notifications/:id/read - mark notification as read
app.put('/api/notifications/:id/read', async (req, res) => {
  const { id } = req.params;

  try {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) {
        console.warn('Notifications table not available for update:', error.message);
      }
    } catch (tableError) {
      console.warn('Notifications table not found for update:', tableError.message);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error in mark read endpoint:', err);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

// POST /api/start - start an exam and generate questions dynamically
app.post('/api/start', async (req, res) => {
  const { userId, examId } = req.body;
  if (!userId || !examId) return res.status(400).json({ error: 'Missing parameters' });

  try {
    // Parse exam details from dynamic exam ID
    let examSubject = 'general';
    let examDifficulty = 'easy';
    let totalQuestions = 10;

    if (examId.startsWith('dynamic_exam_')) {
      // Extract subject from dynamic exam ID: dynamic_exam_{userId}_{interest}_{index}
      const parts = examId.split('_');
      if (parts.length >= 5) {
        examSubject = parts[3];
        const difficultyIndex = parseInt(parts[4]);
        examDifficulty = difficultyIndex === 0 ? 'easy' : 'medium';
        totalQuestions = examDifficulty === 'easy' ? 10 : 15;
      }
    } else if (examId.startsWith('default-')) {
      // Handle default exams
      examSubject = examId === 'default-1' ? 'programming' : 'web';
      examDifficulty = 'easy';
      totalQuestions = examId === 'default-1' ? 10 : 12;
    }

    // Map subjects to more specific topics for better question generation
    const subjectMapping = {
      'web': 'web development including HTML, CSS, and JavaScript',
      'javascript': 'JavaScript programming language',
      'react': 'React JavaScript framework',
      'computer science': 'computer science fundamentals',
      'data science': 'data science and analytics',
      'gaming': 'video game development',
      'programming': 'general programming concepts'
    };
    examSubject = subjectMapping[examSubject] || examSubject;

    // For dynamic exams, create the exam record first
    let actualExamId = examId;
    if (examId.startsWith('dynamic_exam_')) {
      try {
        const parts = examId.split('_');
        const userIdFromId = parts[2];
        const interest = parts[3];
        const difficultyIndex = parseInt(parts[4]);
        const title = `${interest.charAt(0).toUpperCase() + interest.slice(1)} Fundamentals`;
        if (difficultyIndex === 1) {
          title = `Advanced ${interest.charAt(0).toUpperCase() + interest.slice(1)}`;
        }
        const subject = interest;
        const difficulty = difficultyIndex === 0 ? 'easy' : 'medium';
        const total_questions = difficulty === 'easy' ? 10 : 15;
        const duration_minutes = difficulty === 'easy' ? 20 : 30;
        const passing_score = difficulty === 'easy' ? 60 : 70;

        const { data: examData, error: examError } = await supabase
          .from('exams')
          .insert({
            title,
            subject,
            difficulty,
            total_questions,
            duration_minutes,
            passing_score,
            exam_type: 'dynamic'
          })
          .select()
          .single();

        if (examError) {
          console.warn('Failed to create dynamic exam record:', examError);
        } else if (examData) {
          actualExamId = examData.id;
        }
      } catch (e) {
        console.warn('Error creating dynamic exam:', e);
      }
    }

    // Create session in Supabase
    const sessionId = uuidv4();
    try {
      const { error: sessionError } = await supabase
        .from('exam_sessions')
        .insert({
          id: sessionId,
          user_id: userId,
          exam_id: actualExamId,
          started_at: new Date().toISOString(),
          status: 'in_progress',
          is_practice: false
        });

      if (sessionError) {
        console.warn('Supabase session creation failed, continuing without database session:', sessionError);
      }
    } catch (dbError) {
      console.warn('Database session creation failed, continuing without database session:', dbError);
    }

    // Generate questions using Gemini
    const prompt = `Generate ${totalQuestions} unique multiple choice questions specifically about ${examSubject} at ${examDifficulty} difficulty level.

IMPORTANT: Each question must be directly related to ${examSubject}. Do not generate questions about unrelated topics like identifiers, general knowledge, or random strings.

Respond ONLY with a valid JSON array. Do not include any other text, explanations, or formatting.

Each question must have exactly 4 options labeled A), B), C), D).

Format your response as a JSON array like this exact example:
[
  {
    "question": "What is the capital of France?",
    "options": ["A) London", "B) Paris", "C) Berlin", "D) Madrid"],
    "correctAnswer": 1
  },
  {
    "question": "Which planet is closest to the Sun?",
    "options": ["A) Venus", "B) Mars", "C) Mercury", "D) Earth"],
    "correctAnswer": 2
  }
]

Generate ${totalQuestions} questions specifically about ${examSubject}. Make them appropriate for ${examDifficulty} level. Ensure all questions are relevant to ${examSubject} and correctAnswer is the index (0-3) of the correct option.`;

    let questions;
    try {
      questions = await generateQuestionsWithGemini(prompt, totalQuestions);
    } catch (error) {
      console.error('Gemini API failed, using fallback questions:', error);
      questions = generateFallbackQuestions(totalQuestions);
    }

    res.json({ sessionId, questions, examId: actualExamId });
  } catch (err) {
    console.error('Error starting exam:', err);
    res.status(500).json({ error: 'Failed to start exam' });
  }
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
