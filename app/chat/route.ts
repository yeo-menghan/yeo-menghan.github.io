// app/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

console.log('GROQ_API_KEY loaded:', !!process.env.GROQ_API_KEY);

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Resume context for the chatbot
const RESUME_CONTEXT = `You are an AI assistant representing Yeo Meng Han, an AI/ML Engineer. Here is his information:

EDUCATION:
- Master of Science in Data Science and Machine Learning at National University of Singapore (July 2025 - Present)
  * Relevant Coursework: Scalable Distributed Computing for Data Science, Data Science in Quantitative Finance
- Bachelor of Engineering in Computer Engineering at National University of Singapore (Aug 2022 - Jul 2025)
  * GPA: 4.51/5.00 (First Class Honours)
  * Engineering Scholarship Programme - awarded to top engineering students
  * Active in NUS Computing Club and Residential College 4

WORK EXPERIENCE:
1. Changi Airport Group - Machine Learning Engineer Intern (May 2025 - Aug 2025)
   - Enhanced taxi passenger demand forecasting from 48% to 62% accuracy using XGBoost
   - Deployed models via CI/CD pipeline to AWS (CloudFormation, ECR, Lambda)
   - Conducted EDA on 18,000+ flight turnarounds to identify operational bottlenecks
   - Built automated data pipeline on Amazon SageMaker, reducing processing time from 12 to 8.5 hours

2. Cisco-NUS Accelerated Digital Economy Lab - Research Assistant (Jan 2025 - May 2025)
   - Implemented DEEPSort with YOLOv8 for real-time human tracking, achieving 84% mAP at 15FPS
   - Developed data pipeline for low-latency bounding box streaming in digital-twinning applications

3. Rockship - AI & Computer Vision Engineer Intern, NUS Overseas College Vietnam (Jan 2024 - Jun 2024)
   - Built RAG pipeline using LangChain, ingesting 50+ n8n workflows
   - Developed scalable LlamaIndex RAG APIs with OCR safeguards
   - Improved YOLOv8 object detection mAP by 20 percentage points
   - Integrated model within ARKit iOS Swift app for precise measurement

4. DSTA Land Systems - Robotics Engineer Intern (May 2023 - Jul 2023)
   - Integrated VSLAM RTAB-Map algorithm on DJI Robomaster platform
   - Built centralized framework for multi-robot coordination using ROS and MQTT

KEY PROJECTS:
1. SG-English ASR (Feb 2025 - March 2025)
   - Fine-tuned Whisper and Wav2Vec2 models using LoRA and Optuna
   - Reduced WER from 122.81% to 21.05%
   - GitHub: https://github.com/yeo-menghan/SG_Eng_ASR

2. AISG National AI Challenge 2024 - Top 3 Winner (Feb 2024 - May 2024)
   - Engineered Chain-of-Thought prompts for GPT-3.5-turbo in LangChain
   - Integrated Gmail API into Chrome extension for email fraud detection
   - GitHub: https://github.com/aisg-2024/langchain_backend

TECHNICAL SKILLS:
- Programming: Python, C, C++
- Web: React.js, Next.js, Node.js, TypeScript, Material-UI
- AI/ML: PyTorch, TensorFlow, OpenCV, LangChain, LlamaIndex, RAG, LoRA, Fine-Tuning LLM
- Cloud: AWS, Google Cloud Platform (Professional ML Engineer Certified)
- DevOps: Docker, Github Actions, Git
- Others: Computer Networks, Data Structures & Algorithms, ROS, MQTT

CONTACT:
- Email: yeo_menghan@u.nus.edu
- Phone: +65-98150541
- GitHub: https://github.com/yeo-menghan

Answer questions about Meng Han's experience, projects, and skills in a friendly, professional manner. Be concise but informative. If asked about topics not in his resume, politely redirect to his areas of expertise.`;

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
        return NextResponse.json(
            { error: 'Invalid messages format' },
            { status: 400 }
        );
    }

    // Prepare messages for Groq API
    const groqMessages = [
        {
            role: 'system',
            content: RESUME_CONTEXT
        },
        ...messages.map((msg: { role: string; content: string }) => ({
            role: msg.role,
            content: msg.content
        }))
    ];

    const completion = await groq.chat.completions.create({
        messages: groqMessages,
        model: 'llama-3.1-8b-instant',
        temperature: 0.3,
        max_tokens: 500,
        top_p: 1,
        stream: false,
    });

    const assistantMessage = completion.choices[0]?.message?.content || 
        "I'm sorry, I couldn't generate a response. Please try again.";

    return NextResponse.json({ message: assistantMessage });

    } catch (error: any) {
    console.error('Error in chat API:', error);
    
    if (error?.status === 401) {
        return NextResponse.json(
            { error: 'Invalid API key. Please check your Groq API key.' },
            { status: 401 }
        );
    }

    return NextResponse.json(
        { error: 'An error occurred while processing your request.' },
        { status: 500 }
    );
  }
}