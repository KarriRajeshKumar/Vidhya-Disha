# 🤖 AI Mentor Chat Module

A complete, intelligent AI Mentor system powered by Google's latest Gemini 1.5 Pro model for student guidance and career development.

## ✨ Features

### 🧠 AI Intelligence
- **Latest Gemini Model**: Uses `gemini-1.5-pro-latest` for cutting-edge AI responses
- **Contextual Understanding**: Maintains conversation context for coherent dialogue
- **Personalized Responses**: Adapts tone and advice based on user profile data
- **Smart Fallbacks**: Provides contextual fallback responses when API is unavailable

### 💬 Chat Interface
- **Modern UI**: Sleek, responsive chat interface with TailwindCSS
- **Real-time Messaging**: Instant message delivery with typing indicators
- **Infinite Scroll**: Smooth scrolling through conversation history
- **Mobile-First**: Fully responsive design for all devices

### 💾 Data Management
- **Conversation Storage**: All chats saved to Supabase database
- **Message History**: Complete conversation history with timestamps
- **Smart Titles**: Auto-generated conversation titles based on content
- **Search & Filter**: Find conversations quickly with search functionality

### 🔒 Security & Privacy
- **Environment Variables**: API keys safely stored in environment variables
- **Row Level Security**: Database access controlled by Supabase RLS
- **User Authentication**: Protected routes with user authentication
- **Data Encryption**: All data encrypted in transit and at rest

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in your project root:

```env
# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration (if not already set)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file
4. **Never commit your API key to version control**

### 3. Database Setup

Run the migration to create required tables:

```sql
-- This creates conversations and messages tables
-- File: supabase/migrations/20241102000000_create_ai_mentor_tables.sql
```

### 4. Install Dependencies

```bash
npm install @google/generative-ai date-fns uuid
```

### 5. Start Development

```bash
npm run dev
```

Navigate to `/ai-mentor` to start chatting!

## 🏗️ Architecture

### Core Components

```
src/
├── services/
│   ├── aiService.ts           # Gemini AI integration
│   └── conversationService.ts # Database operations
├── pages/
│   └── AIMentor.tsx          # Main chat interface
└── supabase/migrations/
    └── 20241102000000_create_ai_mentor_tables.sql
```

### AI Service (`aiService.ts`)

```typescript
// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro-latest" 
});

// Generate contextual responses
await aiService.generateResponse(message, userProfile, history);
```

### Conversation Service (`conversationService.ts`)

```typescript
// Create new conversation
await conversationService.createConversation(userId, title);

// Add message to conversation
await conversationService.addMessage(conversationId, role, content);

// Load conversation history
await conversationService.getConversationWithMessages(conversationId);
```

## 🎨 UI Components

### Chat Interface Features

- **Message Bubbles**: Distinct styling for user and AI messages
- **Typing Indicator**: Animated dots while AI is thinking
- **Timestamps**: Relative time display for all messages
- **Sidebar**: Conversation history with search functionality
- **Suggested Questions**: Quick-start prompts for new users

### Responsive Design

- **Desktop**: Full sidebar with conversation list
- **Mobile**: Collapsible sidebar with overlay
- **Tablet**: Adaptive layout for medium screens

## 🔧 Configuration

### Gemini Model Settings

```typescript
generationConfig: {
  temperature: 0.7,    // Creativity level
  topK: 40,           // Token selection diversity
  topP: 0.95,         // Nucleus sampling
  maxOutputTokens: 2048, // Response length limit
}
```

### System Prompt Customization

The AI mentor uses dynamic system prompts based on user profiles:

```typescript
const systemPrompt = `
You are Kiro, an intelligent AI mentor...
STUDENT PROFILE:
- Name: ${userProfile.display_name}
- Education: ${userProfile.education_level}
- Skills: ${userProfile.skills?.join(', ')}
...
`;
```

## 📊 Database Schema

### Conversations Table

```sql
CREATE TABLE conversations (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Messages Table

```sql
CREATE TABLE messages (
  id uuid PRIMARY KEY,
  conversation_id uuid REFERENCES conversations(id),
  role text CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

## 🛡️ Security Best Practices

### API Key Management

- ✅ Store in environment variables
- ✅ Use `.env.example` for documentation
- ✅ Add `.env` to `.gitignore`
- ❌ Never hard-code API keys
- ❌ Never commit keys to version control

### Database Security

- ✅ Row Level Security (RLS) enabled
- ✅ User-specific data access policies
- ✅ Encrypted data transmission
- ✅ Input validation and sanitization

## 🚨 Error Handling

### AI Service Errors

```typescript
try {
  const response = await aiService.generateResponse(...);
} catch (error) {
  // Contextual fallback responses
  return generateFallbackResponse(message, userProfile, error);
}
```

### Database Errors

```typescript
try {
  await conversationService.addMessage(...);
} catch (error) {
  console.error('Database error:', error);
  toast({ title: "Error", description: "Failed to save message" });
}
```

## 🎯 Usage Examples

### Basic Chat

```typescript
// Send a message
const response = await aiService.generateResponse(
  "How do I prepare for technical interviews?",
  userProfile,
  conversationHistory
);
```

### Conversation Management

```typescript
// Create new conversation
const conversation = await conversationService.createConversation(
  userId, 
  "Interview Preparation"
);

// Load conversation history
const history = await conversationService.getConversationWithMessages(
  conversationId
);
```

## 🔄 Streaming Responses (Optional)

For real-time response streaming:

```typescript
await aiService.generateStreamingResponse(
  message,
  userProfile,
  history,
  (chunk) => {
    // Update UI with each chunk
    setStreamingResponse(prev => prev + chunk);
  }
);
```

## 📱 Mobile Optimization

- **Touch-friendly**: Large tap targets and smooth scrolling
- **Keyboard handling**: Auto-focus and proper keyboard navigation
- **Responsive layout**: Adapts to all screen sizes
- **Performance**: Optimized for mobile networks

## 🧪 Testing

### Manual Testing Checklist

- [ ] API key configuration works
- [ ] Messages send and receive correctly
- [ ] Conversation history persists
- [ ] Search functionality works
- [ ] Mobile interface is responsive
- [ ] Error handling displays properly

### Test Scenarios

1. **New User**: First-time chat experience
2. **Returning User**: Loading conversation history
3. **API Failure**: Fallback response handling
4. **Network Issues**: Offline behavior
5. **Long Conversations**: Performance with many messages

## 🚀 Deployment

### Environment Variables

Ensure these are set in production:

```env
VITE_GEMINI_API_KEY=your_production_api_key
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
```

### Build Process

```bash
npm run build
```

The build process will:
- Bundle all components
- Optimize for production
- Exclude API keys from client bundle
- Generate static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:

1. Check the error logs in browser console
2. Verify API key configuration
3. Test database connectivity
4. Review Supabase RLS policies

---

**Built with ❤️ using React, TypeScript, TailwindCSS, and Google Gemini AI**