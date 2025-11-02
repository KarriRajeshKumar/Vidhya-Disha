/**
 * Local AI Service - Intelligent responses without external API
 * Provides contextual, helpful responses based on user questions and profile
 */
import { UserProfile, ChatMessage } from './aiService';

interface ResponsePattern {
  keywords: string[];
  responses: string[];
  followUp?: string[];
}

class LocalAIService {
  private responsePatterns: ResponsePattern[] = [
    // Career guidance patterns
    {
      keywords: ['career', 'job', 'profession', 'work', 'employment'],
      responses: [
        "Great question about career development! Based on your interests in {interests}, I'd recommend focusing on building both technical and soft skills. What specific career path are you most curious about?",
        "Career planning is crucial for success! With your background in {education}, you have several exciting paths ahead. Would you like to explore opportunities in {interests} or discover new fields?",
        "I love helping with career decisions! Your skills in {skills} are valuable assets. Let's discuss how to leverage them for your dream career. What type of work environment appeals to you most?"
      ],
      followUp: [
        "What industries interest you most?",
        "Are you looking for immediate opportunities or long-term planning?",
        "Would you like help with job search strategies?"
      ]
    },
    
    // Study and learning patterns
    {
      keywords: ['study', 'learn', 'education', 'course', 'skill', 'training'],
      responses: [
        "Excellent focus on learning! The key to effective studying is creating a structured approach. Based on your {education} level, I recommend breaking your goals into manageable chunks. What subject are you focusing on?",
        "Learning new skills is always exciting! Your current expertise in {skills} gives you a great foundation. What new area would you like to explore?",
        "Study strategies can make a huge difference! For someone at the {experience} level, I suggest combining theory with practical application. What's your biggest learning challenge right now?"
      ],
      followUp: [
        "What's your preferred learning style?",
        "How much time can you dedicate to studying daily?",
        "Are you looking for online resources or formal courses?"
      ]
    },

    // Interview preparation patterns
    {
      keywords: ['interview', 'preparation', 'questions', 'tips', 'practice'],
      responses: [
        "Interview preparation is key to success! With your background in {skills}, you're already ahead. Let me help you prepare effectively. What type of interview are you preparing for?",
        "Great that you're preparing early! For someone with {experience} experience, I recommend focusing on both technical and behavioral questions. What position are you interviewing for?",
        "Interview success comes from preparation and confidence! Your skills in {skills} will definitely impress employers. Would you like help with common questions or presentation techniques?"
      ],
      followUp: [
        "What type of role are you interviewing for?",
        "Have you researched the company culture?",
        "Would you like to practice common interview questions?"
      ]
    },

    // Resume and CV patterns
    {
      keywords: ['resume', 'cv', 'portfolio', 'application', 'profile'],
      responses: [
        "Your resume is your first impression! With your experience in {skills}, we can create something impressive. What type of positions are you targeting?",
        "A strong resume highlights your unique value! Your {education} background and {skills} skills are great selling points. What section would you like to improve?",
        "Portfolio building is crucial in today's market! Your expertise in {interests} can really shine through. Are you looking to create a digital portfolio or traditional resume?"
      ],
      followUp: [
        "What achievements are you most proud of?",
        "Do you have any projects to showcase?",
        "What format works best for your industry?"
      ]
    },

    // Skill development patterns
    {
      keywords: ['skills', 'develop', 'improve', 'growth', 'abilities', 'competencies'],
      responses: [
        "Skill development is the path to success! Your current strengths in {skills} are excellent. What new skills would complement your career goals?",
        "I love your growth mindset! Building on your {education} foundation, there are many exciting skills to explore. What areas interest you most?",
        "Continuous learning is key! Your experience level as {experience} puts you in a great position to expand. What skills do you think would boost your career?"
      ],
      followUp: [
        "Are you interested in technical or soft skills?",
        "What's your timeline for skill development?",
        "Do you prefer hands-on learning or theoretical study?"
      ]
    },

    // Technology and programming patterns
    {
      keywords: ['programming', 'coding', 'development', 'software', 'tech', 'computer', 'web', 'app'],
      responses: [
        "Technology is such an exciting field! With the rapid growth in tech, there are amazing opportunities. What area of technology interests you most?",
        "Programming skills are incredibly valuable! Whether you're interested in web development, mobile apps, or data science, there's a path for you. What draws you to coding?",
        "The tech industry offers diverse career paths! From frontend development to AI/ML, your options are endless. What type of projects would you like to build?"
      ],
      followUp: [
        "Are you interested in web development, mobile apps, or something else?",
        "Do you prefer working on user interfaces or backend systems?",
        "What programming languages interest you?"
      ]
    },

    // General greeting patterns
    {
      keywords: ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon'],
      responses: [
        "Hello {name}! 👋 I'm excited to help you with your career and educational journey. What's on your mind today?",
        "Hi there, {name}! Great to see you. I'm here to provide guidance on careers, studies, and skill development. How can I assist you?",
        "Hey {name}! 🌟 Ready to explore some career possibilities? I'm here to help with any questions about your professional development."
      ],
      followUp: [
        "What career topics interest you most?",
        "Are you exploring new opportunities?",
        "What goals are you working towards?"
      ]
    }
  ];

  /**
   * Generate an intelligent response based on user input and profile
   */
  async generateResponse(
    message: string,
    userProfile: UserProfile,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    console.log('🤖 Generating local AI response...');

    const lowerMessage = message.toLowerCase();
    const name = userProfile.display_name || 'there';
    
    // Find matching pattern
    const matchingPattern = this.responsePatterns.find(pattern =>
      pattern.keywords.some(keyword => lowerMessage.includes(keyword))
    );

    if (matchingPattern) {
      // Select a random response from the pattern
      const randomResponse = matchingPattern.responses[
        Math.floor(Math.random() * matchingPattern.responses.length)
      ];

      // Personalize the response
      let personalizedResponse = this.personalizeResponse(randomResponse, userProfile);

      // Add follow-up question if available
      if (matchingPattern.followUp && Math.random() > 0.5) {
        const randomFollowUp = matchingPattern.followUp[
          Math.floor(Math.random() * matchingPattern.followUp.length)
        ];
        personalizedResponse += `\n\n${randomFollowUp}`;
      }

      console.log('✅ Local AI response generated successfully');
      return personalizedResponse;
    }

    // Default response for unmatched queries
    return this.generateDefaultResponse(message, userProfile);
  }

  /**
   * Personalize response with user profile data
   */
  private personalizeResponse(response: string, userProfile: UserProfile): string {
    const replacements = {
      '{name}': userProfile.display_name || 'there',
      '{education}': userProfile.education_level || 'your current education',
      '{experience}': userProfile.experience_level || 'beginner',
      '{skills}': userProfile.skills?.join(', ') || 'your developing skills',
      '{interests}': userProfile.interests?.join(' and ') || 'your areas of interest'
    };

    let personalizedResponse = response;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      personalizedResponse = personalizedResponse.replace(new RegExp(placeholder, 'g'), value);
    });

    return personalizedResponse;
  }

  /**
   * Generate a thoughtful default response
   */
  private generateDefaultResponse(message: string, userProfile: UserProfile): string {
    const name = userProfile.display_name || 'there';
    
    const defaultResponses = [
      `That's an interesting question, ${name}! While I specialize in career guidance, education planning, and skill development, I'd love to help you explore this topic. Could you tell me more about how this relates to your career goals?`,
      
      `Hi ${name}! I'm here to help with career development, study strategies, and educational planning. Your question is intriguing - how can we connect this to your professional growth?`,
      
      `Great question, ${name}! I focus on helping students and professionals with career guidance, skill development, and educational pathways. What specific aspect of your career or studies would you like to explore?`,
      
      `Hello ${name}! I'm passionate about helping with career planning, interview preparation, resume building, and skill development. How can I assist you in achieving your professional goals today?`
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  /**
   * Generate contextual follow-up suggestions
   */
  generateFollowUpSuggestions(message: string, userProfile: UserProfile): string[] {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('career')) {
      return [
        "What industries interest you most?",
        "Tell me about your dream job",
        "What skills would you like to develop?",
        "Are you looking to change careers or advance in your current field?"
      ];
    }
    
    if (lowerMessage.includes('study') || lowerMessage.includes('learn')) {
      return [
        "What subject are you most passionate about?",
        "How do you prefer to learn - online, in-person, or self-study?",
        "What's your biggest learning challenge?",
        "Are you preparing for any specific exams or certifications?"
      ];
    }
    
    return [
      "What are your main career goals?",
      "What challenges are you facing in your professional development?",
      "How can I help you achieve your next milestone?",
      "What skills would make the biggest impact on your career?"
    ];
  }
}

// Export singleton instance
export const localAIService = new LocalAIService();