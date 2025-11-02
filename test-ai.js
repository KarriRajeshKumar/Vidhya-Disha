// Quick test script to verify Gemini API
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyD6VgaV8emwHkBvtNC2LodbZ4eLYzLqfXk";

async function testGemini() {
  try {
    console.log('🧪 Testing Gemini API...');
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent("Hello, please respond with 'Gemini is working!'");
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS:', text);
    return text;
  } catch (error) {
    console.error('❌ ERROR:', error);
    return null;
  }
}

testGemini();