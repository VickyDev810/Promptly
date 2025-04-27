import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiResponse } from '../types';

dotenv.config();

// Initialize Gemini with API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'your-gemini-api-key';
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

// Log configuration (excluding API key)
console.log(`Using Gemini model: ${MODEL_NAME}`);

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// Format instructions to include in prompt
const FORMAT_INSTRUCTIONS = `
Output ONLY a valid JSON object with the following structure, nothing else before or after:
{
  "confidence": 0.0-1.0,
  "answer": "Your answer here",
  "escalate_to_human": true/false,
  "tags": ["tag1", "tag2", "tag3"]
}

Guidelines:
- "confidence" should be a number between 0.0 and 1.0
- "answer" should be your detailed response to the question
- "escalate_to_human" should be true if the question is complex or requires human expertise
- "tags" should be relevant technology keywords for categorizing the question (2-5 tags)

Confidence scale:
- 0.8-1.0: Very confident, comprehensive answer
- 0.5-0.8: Moderately confident, good answer but may have limitations
- <0.5: Low confidence, question likely needs human expertise
`;

/**
 * Process a question with Gemini API
 * @param question The question to ask Gemini
 * @returns GeminiResponse object with AI response
 */
export const processQuestion = async (question: string): Promise<GeminiResponse> => {
  try {
    console.log(`Processing question: "${question.substring(0, 50)}${question.length > 50 ? '...' : ''}"`);
    
    // Configure model with generation parameters
    const generationConfig = {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 1024,
    };

    // Create the prompt with instructions built in
    const prompt = `You're an AI assistant for a Q&A platform specializing in technical and general topics. Answer user questions clearly, accurately, and professionally.

- Provide a detailed answer if confident.
- If unsure or if the question needs specialized human expertise, give a basic response and mark it for escalation.

QUESTION: ${question}

${FORMAT_INSTRUCTIONS}

Only output the JSON object, no extra text.`;

    console.log('Sending request to Gemini API...');
    
    // Generate response from Gemini
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig
    });
    
    console.log('Received response from Gemini API');
    const responseText = result.response.text();
    
    try {
      // Try to identify JSON in the response
      let jsonText = responseText;
      
      // If response has text before or after JSON object, extract just the JSON
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        jsonText = responseText.substring(jsonStart, jsonEnd + 1);
        if (jsonStart > 0 || jsonEnd < responseText.length - 1) {
          console.log('Extracted JSON from response');
        }
      }
      
      // Parse JSON response from Gemini
      const parsedResponse = JSON.parse(jsonText);
      
      // Validate response format
      if (!parsedResponse.confidence || !parsedResponse.answer) {
        console.warn('Invalid response format from Gemini:', responseText);
        throw new Error('Invalid response format from Gemini');
      }

      // Ensure tags is an array
      if (!Array.isArray(parsedResponse.tags)) {
        console.warn('Tags is not an array, setting to empty array');
        parsedResponse.tags = [];
      }

      const response = {
        confidence: Number(parsedResponse.confidence),
        answer: parsedResponse.answer,
        escalate_to_human: Boolean(parsedResponse.escalate_to_human),
        tags: parsedResponse.tags
      };
      
      console.log(`Response generated with confidence: ${response.confidence}, escalate: ${response.escalate_to_human}, tags: ${response.tags.join(', ')}`);
      return response;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.log('Raw response:', responseText);
      
      // Try to extract useful content if the response isn't proper JSON
      let answer = "I processed your question but encountered an issue with my response formatting. Your question might need expert attention.";
      try {
        // If the response contains text that looks like an answer, use it
        if (responseText.length > 20) {
          answer = responseText.substring(0, 500) + (responseText.length > 500 ? '...' : '');
        }
      } catch (e) {
        console.error('Error extracting fallback answer:', e);
      }
      
      // Fallback response if parsing fails
      return {
        confidence: 0.3,
        answer,
        escalate_to_human: true,
        tags: ['parsing-error']
      };
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    throw error;
  }
}; 