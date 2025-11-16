import Groq from 'groq-sdk';
import { getWebsiteContent } from './content';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function queryRAG(userMessage: string): Promise<string> {
  const websiteContent = getWebsiteContent();

  const systemPrompt = `You are a helpful AI assistant representing Yeo Meng Han's personal website. You have access to information about his background, projects, work experience, skills, opinions, and technical notes.

Here is the complete website content:

${websiteContent}

Please answer the user's question based on this information. If the question is about something not covered in the website content, politely let them know and offer to help with topics that are covered.

Be conversational, helpful, and specific. When discussing projects, include relevant details like technologies used, achievements, and outcomes. When appropriate, suggest related content the user might find interesting.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to get response from AI');
  }
}