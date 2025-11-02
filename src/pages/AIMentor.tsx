/**
 * AI Mentor Chat Interface
 * Modern, responsive chat UI with Gemini 1.5 Pro Latest integration
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Send, 
  Bot, 
  User, 
  MessageCircle, 
  Sparkles, 
  History,
  Plus,
  Search,
  Trash2,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiService, ChatMessage, UserProfile } from '@/services/aiService';
import { conversationService, Conversation, ConversationWithMessages } from '@/services/conversationService';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface TypingIndicatorProps {
  isVisible: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-primary-foreground" />
      </div>
      <div className="bg-secondary/80 p-4 rounded-2xl rounded-bl-none max-w-[80%]">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <span className="text-muted-foreground text-sm">Kiro is thinking...</span>
        </div>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: ChatMessage;
  isUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser }) => {
  return (
    <div className={cn(
      "flex gap-3 mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] p-4 rounded-2xl",
        isUser 
          ? "bg-primary text-primary-foreground rounded-br-none" 
          : "bg-secondary/80 text-foreground rounded-bl-none"
      )}>
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </div>
        {message.timestamp && (
          <div className={cn(
            "text-xs mt-2 opacity-70",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}>
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
};

const AIMentor: React.FC = () => {
  // State management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<ConversationWithMessages | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { profile } = useProfile();
  const { toast } = useToast();

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load conversations on mount
  useEffect(() => {
    if (profile?.user_id) {
      loadConversations();
    }
  }, [profile]);

  // Load user conversations
  const loadConversations = async () => {
    if (!profile?.user_id) return;

    try {
      const userConversations = await conversationService.getUserConversations(profile.user_id);
      setConversations(userConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation history",
        variant: "destructive"
      });
    }
  };

  // Create new conversation
  const createNewConversation = async (firstMessage: string) => {
    if (!profile?.user_id) return null;

    try {
      const title = conversationService.generateConversationTitle(firstMessage);
      const conversation = await conversationService.createConversation(profile.user_id, title);
      
      if (conversation) {
        await loadConversations();
        return conversation;
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
    return null;
  };

  // Load conversation messages
  const loadConversation = async (conversationId: string) => {
    try {
      const conversation = await conversationService.getConversationWithMessages(conversationId);
      if (conversation) {
        setCurrentConversation(conversation);
        setMessages(conversation.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at)
        })));
        setShowSidebar(false);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive"
      });
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || isLoading || !profile) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create conversation if this is the first message
      let conversationId = currentConversation?.id;
      if (!conversationId) {
        const newConversation = await createNewConversation(userMessage.content);
        if (newConversation) {
          conversationId = newConversation.id;
          setCurrentConversation({
            ...newConversation,
            messages: []
          });
        }
      }

      // Save user message to database
      if (conversationId) {
        await conversationService.addMessage(conversationId, 'user', userMessage.content);
      }

      // Get AI response
      const userProfile: UserProfile = {
        id: profile.user_id,
        display_name: profile.display_name || undefined,
        email: profile.email || undefined,
        education_level: profile.education_level || undefined,
        experience_level: profile.experience_level || undefined,
        skills: profile.skills || undefined,
        interests: profile.interests || undefined,
        goals: undefined, // goals field not available in current profile schema
        bio: profile.bio || undefined,
      };

      const response = await aiService.generateResponse(
        userMessage.content,
        userProfile,
        messages,
        conversationId
      );

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      // Add AI response to UI
      setMessages(prev => [...prev, assistantMessage]);

      // Save AI response to database
      if (conversationId) {
        await conversationService.addMessage(conversationId, 'assistant', response);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble processing your message right now. Please try again in a moment.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Start new conversation
  const startNewConversation = () => {
    setCurrentConversation(null);
    setMessages([]);
    setShowSidebar(false);
    inputRef.current?.focus();
  };

  // Delete conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      await conversationService.deleteConversation(conversationId);
      await loadConversations();
      
      if (currentConversation?.id === conversationId) {
        startNewConversation();
      }
      
      toast({
        title: "Success",
        description: "Conversation deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive"
      });
    }
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Suggested questions for new users
  const suggestedQuestions = [
    "How do I choose the right career path?",
    "What skills should I develop for my field?",
    "How can I prepare for job interviews?",
    "What's the best way to build a professional network?",
    "How do I create an impressive resume?",
    "What are the current trends in my industry?"
  ];

  return (
    <Layout>
      <div className="flex h-[calc(100vh-4rem)] bg-background">
        {/* Sidebar */}
        <div className={cn(
          "w-80 bg-card border-r border-border flex flex-col transition-all duration-300",
          showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Conversations
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={startNewConversation}
                className="text-primary hover:text-primary/80"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs">Start chatting to see your history here</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors mb-2 group",
                      currentConversation?.id === conversation.id && "bg-secondary"
                    )}
                    onClick={() => loadConversation(conversation.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-foreground truncate mb-1">
                          {conversation.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conversation.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  <History className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-foreground">Kiro AI Mentor</h1>
                    <p className="text-xs text-muted-foreground">Powered by Gemini 1.5 Pro Latest</p>
                  </div>
                </div>
              </div>
              
              {currentConversation && (
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{currentConversation.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(currentConversation.updated_at), { addSuffix: true })}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-4xl mx-auto">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Welcome to Kiro AI Mentor! 👋
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    I'm here to help you with career guidance, study strategies, and educational planning. 
                    What would you like to discuss today?
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="p-4 h-auto text-left justify-start hover:bg-secondary/80"
                        onClick={() => setInput(question)}
                      >
                        <div className="text-sm">{question}</div>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <MessageBubble
                      key={index}
                      message={message}
                      isUser={message.role === 'user'}
                    />
                  ))}
                  <TypingIndicator isVisible={isLoading} />
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask me anything about your career or studies..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground">
                  Kiro AI can make mistakes. Please verify important information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default AIMentor;