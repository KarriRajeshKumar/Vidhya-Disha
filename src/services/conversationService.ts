/**
 * Conversation Service for managing chat history in Supabase
 * Handles CRUD operations for conversations and messages
 */
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage, UserProfile } from './aiService';
import { v4 as uuidv4 } from 'uuid';

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

class ConversationService {
  /**
   * Create a new conversation
   */
  async createConversation(userId: string, title: string): Promise<Conversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          title: title.slice(0, 100), // Limit title length
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }

  /**
   * Get all conversations for a user
   */
  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  /**
   * Get a conversation with all its messages
   */
  async getConversationWithMessages(conversationId: string): Promise<ConversationWithMessages | null> {
    try {
      // Get conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (convError || !conversation) {
        console.error('Error fetching conversation:', convError);
        return null;
      }

      // Get messages
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) {
        console.error('Error fetching messages:', msgError);
        return null;
      }

      return {
        ...conversation,
        messages: messages || []
      };
    } catch (error) {
      console.error('Error fetching conversation with messages:', error);
      return null;
    }
  }

  /**
   * Add a message to a conversation
   */
  async addMessage(
    conversationId: string, 
    role: 'user' | 'assistant', 
    content: string
  ): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role,
          content,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding message:', error);
        return null;
      }

      // Update conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  }

  /**
   * Update conversation title
   */
  async updateConversationTitle(conversationId: string, title: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ 
          title: title.slice(0, 100),
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (error) {
        console.error('Error updating conversation title:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating conversation title:', error);
      return false;
    }
  }

  /**
   * Delete a conversation and all its messages
   */
  async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      // Delete messages first (due to foreign key constraint)
      const { error: msgError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (msgError) {
        console.error('Error deleting messages:', msgError);
        return false;
      }

      // Delete conversation
      const { error: convError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (convError) {
        console.error('Error deleting conversation:', convError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }

  /**
   * Generate a smart title for a conversation based on the first message
   */
  generateConversationTitle(firstMessage: string): string {
    const message = firstMessage.toLowerCase().trim();
    
    // Common patterns for generating titles
    if (message.includes('career') && message.includes('advice')) {
      return '💼 Career Advice Discussion';
    }
    if (message.includes('interview')) {
      return '🎯 Interview Preparation';
    }
    if (message.includes('resume') || message.includes('cv')) {
      return '📄 Resume Help';
    }
    if (message.includes('study') || message.includes('learn')) {
      return '📚 Study Strategy';
    }
    if (message.includes('skill') && message.includes('develop')) {
      return '🚀 Skill Development';
    }
    if (message.includes('college') || message.includes('university')) {
      return '🎓 College Guidance';
    }
    if (message.includes('job') || message.includes('work')) {
      return '💼 Job Search Help';
    }
    if (message.includes('hello') || message.includes('hi')) {
      return '👋 Getting Started';
    }

    // Fallback: use first few words
    const words = firstMessage.split(' ').slice(0, 4).join(' ');
    return words.length > 30 ? words.slice(0, 30) + '...' : words;
  }

  /**
   * Search conversations by content
   */
  async searchConversations(userId: string, query: string): Promise<ConversationWithMessages[]> {
    try {
      // Search in conversation titles and message content
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
          *,
          messages (*)
        `)
        .eq('user_id', userId)
        .or(`title.ilike.%${query}%`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error searching conversations:', error);
        return [];
      }

      // Also search in message content
      const { data: messageMatches, error: msgError } = await supabase
        .from('messages')
        .select(`
          conversation_id,
          conversations!inner (
            *,
            messages (*)
          )
        `)
        .textSearch('content', query)
        .eq('conversations.user_id', userId);

      if (msgError) {
        console.error('Error searching messages:', msgError);
      }

      // Combine and deduplicate results
      const allResults = [...(conversations || [])];
      const conversationIds = new Set(allResults.map(c => c.id));

      if (messageMatches) {
        messageMatches.forEach(match => {
          if (!conversationIds.has(match.conversation_id)) {
            allResults.push(match.conversations);
          }
        });
      }

      return allResults as ConversationWithMessages[];
    } catch (error) {
      console.error('Error searching conversations:', error);
      return [];
    }
  }
}

// Export singleton instance
export const conversationService = new ConversationService();