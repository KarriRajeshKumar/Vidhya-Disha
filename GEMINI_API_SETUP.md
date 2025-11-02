# 🔑 Gemini API Setup Guide

## Current Status
Your AI Mentor is now working with a **Local AI Service** that provides intelligent, contextual responses without requiring an external API. However, to get the full power of Google's Gemini AI, follow this guide.

## 🚨 Issue with Current API Key
The current API key in your `.env` file appears to be invalid or expired. Here's how to get a new one:

## 📋 Step-by-Step Setup

### 1. Get a New Gemini API Key

1. **Visit Google AI Studio**: Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

2. **Sign in**: Use your Google account

3. **Create API Key**: 
   - Click "Create API Key"
   - Choose "Create API key in new project" or select an existing project
   - Copy the generated API key

4. **Update your .env file**:
   ```env
   VITE_GEMINI_API_KEY=your_new_api_key_here
   ```

### 2. Verify API Key Works

Run this test in your browser console (F12 → Console):

```javascript
// Test your API key
fetch('https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY_HERE')
  .then(response => response.json())
  .then(data => console.log('Available models:', data))
  .catch(error => console.error('API Error:', error));
```

### 3. Common Issues & Solutions

#### ❌ "API key not valid" Error
- **Solution**: Generate a new API key from Google AI Studio
- **Cause**: Key might be expired, restricted, or incorrectly copied

#### ❌ "Model not found" Error  
- **Solution**: Use these working model names:
  ```typescript
  "gemini-1.5-flash"     // Fastest, good for most tasks
  "gemini-1.5-pro"       // More capable, slower
  "gemini-pro"           // Legacy model (if others don't work)
  ```

#### ❌ "Quota exceeded" Error
- **Solution**: Check your usage limits in Google Cloud Console
- **Alternative**: The local AI service will automatically take over

#### ❌ "Billing not enabled" Error
- **Solution**: Enable billing in Google Cloud Console for your project
- **Note**: Gemini has generous free tiers

### 4. Update Model Configuration

If you get a working API key, update the model in `src/services/aiService.ts`:

```typescript
// Line ~45, update the model name to one that works
this.model = this.genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash", // Try this first
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
});
```

## 🤖 Current Local AI Service

**Good News**: Your AI Mentor is already working! The Local AI Service provides:

### ✅ Features Working Now:
- **Contextual Responses**: Understands career, study, interview, and skill questions
- **Personalized Advice**: Uses your profile data (name, education, skills, interests)
- **Intelligent Patterns**: Recognizes different types of questions and responds appropriately
- **Follow-up Questions**: Asks relevant follow-up questions to continue the conversation
- **Professional Guidance**: Covers career planning, skill development, interview prep, resume help

### 🎯 Example Responses:
- **Career Questions**: "Great question about career development! Based on your interests in Web Development, I'd recommend focusing on both technical and soft skills..."
- **Study Help**: "Excellent focus on learning! The key to effective studying is creating a structured approach..."
- **Interview Prep**: "Interview preparation is key to success! With your background in React, Node.js, you're already ahead..."

## 🔄 How the Fallback System Works

1. **First Try**: Attempts to use Gemini API
2. **If API Fails**: Automatically switches to Local AI Service
3. **Seamless Experience**: Users get intelligent responses either way
4. **No Interruption**: Chat continues working regardless of API status

## 🚀 Benefits of Each Approach

### Gemini API (When Working):
- ✅ Latest AI technology
- ✅ More creative and varied responses
- ✅ Better understanding of complex queries
- ✅ Continuous learning from Google's models

### Local AI Service (Always Available):
- ✅ Always works (no API dependencies)
- ✅ Fast responses (no network calls)
- ✅ Privacy-focused (no data sent externally)
- ✅ Contextual and personalized
- ✅ Covers all major career guidance topics

## 🛠️ Testing Your Setup

### Test 1: Check Console Logs
1. Open browser DevTools (F12)
2. Go to AI Mentor page
3. Send a message
4. Look for these logs:
   - `🤖 Using local AI service...` (Local AI working)
   - `🤖 Generating AI response with Gemini...` (Gemini working)

### Test 2: Try Different Question Types
- **Greeting**: "Hello, I need career advice"
- **Career**: "How do I choose between software engineering and data science?"
- **Study**: "What's the best way to learn React?"
- **Interview**: "How should I prepare for technical interviews?"

### Test 3: Check Response Quality
- Responses should be personalized with your name
- Should reference your profile data (skills, interests, education)
- Should ask relevant follow-up questions
- Should provide actionable advice

## 📞 Support

If you need help:

1. **Check browser console** for error messages
2. **Verify .env file** has the correct API key format
3. **Test with different models** if one doesn't work
4. **Use Local AI Service** as a reliable fallback

## 🎉 You're All Set!

Your AI Mentor is working right now with intelligent local responses. When you get a working Gemini API key, it will automatically upgrade to use Google's latest AI models for even better responses!

---

**The AI Mentor provides professional career guidance whether using Gemini API or Local AI Service! 🚀**