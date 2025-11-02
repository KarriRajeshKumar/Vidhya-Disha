// @ts-nocheck
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  url: string;
  trending?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const SERPAPI_KEY = Deno.env.get('SERPAPI_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    if (!SERPAPI_KEY) {
      throw new Error('SERPAPI_KEY is not set');
    }

    // Get current date for fresh news
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dateString = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Search for education and career news using SerpAPI
    const serpApiUrl = `https://serpapi.com/search.json?engine=google_news&q=education+career+development+india&gl=in&hl=en&tbm=nws&tbs=qdr:d&api_key=${SERPAPI_KEY}`;

    const serpResponse = await fetch(serpApiUrl);
    const serpData = await serpResponse.json();

    if (!serpResponse.ok) {
      throw new Error('Failed to fetch news from SerpAPI');
    }

    // Extract top 8 news items
    const rawNews = serpData.news_results?.slice(0, 8) || [];

    if (rawNews.length === 0) {
      // Fallback to Gemini-generated news if SerpAPI fails
      const fallbackPrompt = `Generate 8 recent news articles about education and career development in India. Each article should have:
      - Title (engaging and relevant)
      - Brief excerpt (2-3 sentences)
      - Author name
      - Date (recent, within last week)
      - Category (Technology, Careers, Education, Skills, Environment, Wellness)
      - Read time estimate (3-8 minutes)

      Format as JSON array with these fields. Make them realistic and educational.`;

      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: fallbackPrompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 2000,
          }
        }),
      });

      const geminiData = await geminiResponse.json();
      const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

      // Try to parse the JSON response
      try {
        const fallbackNews = JSON.parse(generatedText.replace(/```json\n?|\n?```/g, ''));
        const newsItems: NewsItem[] = fallbackNews.map((item: any, index: number) => ({
          id: `fallback-${index + 1}`,
          title: item.title || `Education News ${index + 1}`,
          excerpt: item.excerpt || 'Latest updates in education and career development.',
          author: item.author || 'Career Navigator',
          date: item.date || dateString,
          readTime: item.readTime || '5 min read',
          category: item.category || 'Education',
          image: '/api/placeholder/400/250',
          url: '#',
          trending: index < 2 // Mark first 2 as trending
        }));

        return new Response(JSON.stringify({ news: newsItems }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error('Failed to parse Gemini fallback response:', parseError);
        throw new Error('Failed to generate fallback news');
      }
    }

    // Process real news from SerpAPI and enhance with Gemini
    const newsPromises = rawNews.map(async (item: any, index: number) => {
      try {
        // Use Gemini to create a better excerpt and categorize the news
        const enhancePrompt = `Given this news article, create a better, more engaging excerpt (2-3 sentences) and categorize it appropriately. Also estimate reading time.

        Title: ${item.title}
        Original snippet: ${item.snippet || 'No snippet available'}

        Return only JSON with: {"excerpt": "better excerpt here", "category": "one of: Technology, Careers, Education, Skills, Environment, Wellness", "readTime": "X min read"}`;

        const enhanceResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: enhancePrompt }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 300,
            }
          }),
        });

        const enhanceData = await enhanceResponse.json();
        const enhanceText = enhanceData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

        let enhancedInfo = { excerpt: item.snippet || 'Latest updates in education and career development.', category: 'Education', readTime: '5 min read' };

        try {
          enhancedInfo = JSON.parse(enhanceText.replace(/```json\n?|\n?```/g, ''));
        } catch (e) {
          console.log('Failed to parse enhanced info, using defaults');
        }

        return {
          id: `news-${index + 1}`,
          title: item.title,
          excerpt: enhancedInfo.excerpt,
          author: item.source || 'News Source',
          date: item.date || dateString,
          readTime: enhancedInfo.readTime,
          category: enhancedInfo.category,
          image: item.thumbnail || '/api/placeholder/400/250',
          url: item.link || '#',
          trending: index < 2 // Mark first 2 as trending
        };
      } catch (error) {
        console.error(`Failed to enhance news item ${index}:`, error);
        // Return basic version if enhancement fails
        return {
          id: `news-${index + 1}`,
          title: item.title,
          excerpt: item.snippet || 'Latest updates in education and career development.',
          author: item.source || 'News Source',
          date: item.date || dateString,
          readTime: '5 min read',
          category: 'Education',
          image: item.thumbnail || '/api/placeholder/400/250',
          url: item.link || '#',
          trending: index < 2
        };
      }
    });

    const newsItems = await Promise.all(newsPromises);

    return new Response(JSON.stringify({ news: newsItems }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-news function:', error);
    return new Response(JSON.stringify({
      error: error.message || 'Internal server error',
      news: [] // Return empty array as fallback
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});