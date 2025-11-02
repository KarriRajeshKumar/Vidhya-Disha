/**
 * AI Service for Gemini 1.5 Pro Latest Integration
 * Handles all AI-related operations with proper error handling and context management
 * Falls back to local AI service when external API is unavailable
 */
import { GoogleGenerativeAI, GenerativeModel, ChatSession } from "@google/generative-ai";
import { localAIService } from './localAIService';

// Types for better type safety
export interface UserProfile {
  id?: string;
  display_name?: string;
  email?: string;
  education_level?: string;
  experience_level?: string;
  skills?: string[];
  interests?: string[];
  goals?: string[];
  bio?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ConversationContext {
  messages: ChatMessage[];
  userProfile: UserProfile;
  conversationId?: string;
}

class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private chatSessions: Map<string, ChatSession> = new Map();
  private useLocalAI: boolean = false;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      console.warn('⚠️ Gemini API key not configured. Using local AI service.');
      this.useLocalAI = true;
      return;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      
      // Try different model names in order of preference
      const modelNames = [
        "gemini-1.5-pro",
        "gemini-pro",
        "gemini-1.5-pro-latest"
      ];
      
      this.model = this.genAI.getGenerativeModel({ 
        model: modelNames[0], // Start with most stable model
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });
      
      console.log(`🤖 Initialized Gemini AI with model: ${modelNames[0]}`);
    } catch (error) {
      console.warn('⚠️ Failed to initialize Gemini AI. Using local AI service.', error);
      this.useLocalAI = true;
    }
  }

  /**
   * Generate a system prompt based on user profile and context
   */
  private generateSystemPrompt(userProfile: UserProfile): string {
    const name = userProfile.display_name || 'Student';
    const education = userProfile.education_level || 'Not specified';
    const experience = userProfile.experience_level || 'Beginner';
    const skills = userProfile.skills?.join(', ') || 'None specified';
    const interests = userProfile.interests?.join(', ') || 'None specified';
    const goals = userProfile.goals?.join(', ') || 'Not specified';

    return `You are Kiro, an intelligent AI mentor and career guidance counselor for students. You provide personalized, encouraging, and actionable advice.

STUDENT PROFILE:
- Name: ${name}
- Education Level: ${education}
- Experience Level: ${experience}
- Skills: ${skills}
- Interests: ${interests}
- Goals: ${goals}

PERSONALITY & TONE:
- Be warm, encouraging, and supportive
- Use the student's name when appropriate
- Provide specific, actionable advice
- Ask follow-up questions to better understand their needs
- Be concise but comprehensive
- Use emojis sparingly but effectively

EXPERTISE AREAS:
- Career guidance and planning
- Educational pathways
- Skill development recommendations
- Interview preparation
- Resume and portfolio advice
- Industry insights and trends
- Study strategies and time management
- Goal setting and achievement

RESPONSE GUIDELINES:
- Always be helpful and constructive
- Provide specific examples when possible
- Suggest concrete next steps
- Acknowledge the student's current level and progress
- Encourage continuous learning and growth
- If you don't know something, admit it and suggest resources

Remember: You're here to guide, mentor, and inspire students to achieve their career and educational goals.`;
  }

  /**
   * Generate a response using Gemini AI or local AI service
   */
  async generateResponse(
    message: string, 
    userProfile: UserProfile, 
    conversationHistory: ChatMessage[] = [],
    conversationId?: string
  ): Promise<string> {
    // Use local AI service if Gemini is not available
    if (this.useLocalAI || !this.model || !this.genAI) {
      console.log('🤖 Using local AI service...');
      return await localAIService.generateResponse(message, userProfile, conversationHistory);
    }

    try {
      console.log('🤖 Generating AI response with Gemini...');

      // Get or create chat session for conversation continuity
      let chatSession: ChatSession;
      
      if (conversationId && this.chatSessions.has(conversationId)) {
        chatSession = this.chatSessions.get(conversationId)!;
      } else {
        // Create new chat session with system prompt
        const systemPrompt = this.generateSystemPrompt(userProfile);
        chatSession = this.model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: systemPrompt }],
            },
            {
              role: "model", 
              parts: [{ text: "Hello! I'm Kiro, your AI mentor. I'm here to help you with your career and educational journey. How can I assist you today?" }],
            },
            // Add conversation history
            ...conversationHistory.map(msg => ({
              role: msg.role === 'user' ? 'user' as const : 'model' as const,
              parts: [{ text: msg.content }],
            }))
          ],
        });

        if (conversationId) {
          this.chatSessions.set(conversationId, chatSession);
        }
      }

      // Send message and get response
      const result = await chatSession.sendMessage(message);
      const response = result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini');
      }

      console.log('✅ Gemini AI response generated successfully');
      return text.trim();

    } catch (error: any) {
      console.error('❌ Gemini AI Error, falling back to local AI:', error.message);
      
      // Fall back to local AI service
      this.useLocalAI = true;
      return await localAIService.generateResponse(message, userProfile, conversationHistory);
    }
  }

  /**
   * Generate streaming response (if supported by SDK)
   */
  async generateStreamingResponse(
    message: string,
    userProfile: UserProfile,
    conversationHistory: ChatMessage[] = [],
    onChunk: (chunk: string) => void
  ): Promise<string> {
    // Use local AI service if Gemini is not available
    if (this.useLocalAI || !this.model || !this.genAI) {
      const response = await localAIService.generateResponse(message, userProfile, conversationHistory);
      onChunk(response);
      return response;
    }

    try {
      const systemPrompt = this.generateSystemPrompt(userProfile);
      const chat = this.model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: systemPrompt }],
          },
          {
            role: "model",
            parts: [{ text: "I'm ready to help you with your questions!" }],
          },
        ],
      });

      const result = await chat.sendMessageStream(message);
      let fullResponse = '';

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        onChunk(chunkText);
      }

      return fullResponse;
    } catch (error) {
      console.error('❌ Streaming Error, using local AI:', error);
      const fallback = await localAIService.generateResponse(message, userProfile, conversationHistory);
      onChunk(fallback);
      return fallback;
    }
  }

  /**
   * Get intelligent response using local AI service
   */
  private async getLocalResponse(
    message: string, 
    userProfile: UserProfile, 
    conversationHistory: ChatMessage[]
  ): Promise<string> {
    return await localAIService.generateResponse(message, userProfile, conversationHistory);
  }

  /**
   * Clear chat session for a conversation
   */
  clearChatSession(conversationId: string): void {
    this.chatSessions.delete(conversationId);
  }

  /**
   * Get model info (for debugging)
   */
  getModelInfo(): string {
    return "gemini-1.5-pro-latest";
  }
}

// Export singleton instance
export const aiService = new AIService();