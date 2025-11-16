import Groq from 'groq-sdk';
import { getContentByType } from './content';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ContentChunk {
  type: 'project' | 'opinion' | 'note';
  title: string;
  content: string;
  metadata: Record<string, any>;
}

function chunkContent(): ContentChunk[] {
  const chunks: ContentChunk[] = [];

  // Add projects
  const projects = getContentByType('projects');
  projects.forEach(project => {
    chunks.push({
      type: 'project',
      title: project.title,
      content: `${project.title}\n\n${project.description}\n\n${project.content}`,
      metadata: {
        slug: project.slug,
        date: project.date,
        tags: project.tags,
        github: project.github,
      },
    });
  });

  // Add opinions
  const opinions = getContentByType('opinions');
  opinions.forEach(opinion => {
    chunks.push({
      type: 'opinion',
      title: opinion.title,
      content: `${opinion.title}\n\n${opinion.excerpt || ''}\n\n${opinion.content}`,
      metadata: {
        slug: opinion.slug,
        date: opinion.date,
        readTime: opinion.readTime,
      },
    });
  });

  // Add notes
  const notes = getContentByType('notes');
  notes.forEach(note => {
    chunks.push({
      type: 'note',
      title: note.title,
      content: `${note.title}\n\nCategory: ${note.category}\n\n${note.content}`,
      metadata: {
        slug: note.slug,
        date: note.date,
        category: note.category,
        paper: note.paper,
      },
    });
  });

  return chunks;
}

function simpleRelevanceScore(query: string, content: string): number {
  const queryLower = query.toLowerCase();
  const contentLower = content.toLowerCase();
  
  const queryWords = queryLower.split(/\s+/);
  let score = 0;

  queryWords.forEach(word => {
    if (word.length < 3) return; // Skip short words
    const regex = new RegExp(word, 'gi');
    const matches = contentLower.match(regex);
    if (matches) {
      score += matches.length;
    }
  });

  // Boost score for title matches
  if (contentLower.includes(queryLower)) {
    score += 10;
  }

  return score;
}

function retrieveRelevantContent(query: string, topK: number = 5): ContentChunk[] {
  const chunks = chunkContent();
  
  const scoredChunks = chunks.map(chunk => ({
    chunk,
    score: simpleRelevanceScore(query, chunk.content),
  }));

  scoredChunks.sort((a, b) => b.score - a.score);

  return scoredChunks
    .slice(0, topK)
    .filter(item => item.score > 0)
    .map(item => item.chunk);
}

export async function queryRAGAdvanced(userMessage: string): Promise<string> {
  const relevantChunks = retrieveRelevantContent(userMessage);

  let context = '';
  
  if (relevantChunks.length > 0) {
    context = 'Here is the most relevant information from the website:\n\n';
    relevantChunks.forEach((chunk, index) => {
      context += `=== ${chunk.type.toUpperCase()}: ${chunk.title} ===\n`;
      context += `${chunk.content}\n\n`;
    });
  } else {
    // Fallback to general information
    context = `General information about Yeo Meng Han:
- Master of Science in Data Science and Machine Learning at NUS
- Bachelor of Engineering in Computer Engineering from NUS (First Class Honours)
- Specializes in Machine Learning, Computer Vision, and NLP
- Experience with ML engineering, research, and AI applications
- Skills: Python, PyTorch, TensorFlow, React, Next.js, AWS
- Email: yeomenghan1989@gmail.com
`;
  }

  const systemPrompt = `You are a helpful AI assistant representing Yeo Meng Han's personal website. Answer the user's question based on the following context.

<context>
${context}
</context>

Guidelines:
- Be conversational and helpful
- If the question is about something not in the context, politely say so and suggest what topics you can help with
- When discussing projects, include specific details and achievements
- Suggest related content when appropriate
- Keep responses concise but informative`;

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
      temperature: 0.3,
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