import { Briefcase, GraduationCap, Heart } from 'lucide-react';
import CTABar from '@/components/CTABar';
import Portrait from '@/components/Portrait';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-start gap-8 md:gap-10">
        {/* Text Content */}
        <div className="md:order-first">
          <h1 className="text-4xl font-bold mb-2">
            Hi, I&apos;m Meng Han{' '}
            <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">
            Aspiring AI/ML Engineer based in Singapore 🇸🇬.
          </p>

          {/* Open to Work Box */}
          <section className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 mb-6">
            <h2 className="text-xl font-semibold mb-2">Open to Work & Collaboration</h2>
            <p className="text-slate-700 dark:text-slate-300">
              I’m actively seeking opportunities in AI/ML engineering and welcome collaborations on VLMs, LLMs, computer vision, or real-world ML applications.
            </p>
          </section>

          <CTABar />
        </div>

        {/* Portrait */}
        <div className="md:order-last">
          <Portrait />
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <GraduationCap className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold">Education</h2>
        </div>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-600 dark:border-blue-400 pl-4">
            <h3 className="font-semibold text-lg">Master of Science in Data Science & Machine Learning</h3>
            <p className="text-slate-600 dark:text-slate-400">National University of Singapore</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">August 2025 - Present</p>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Relevant Coursework: Scalable Distributed Computing for Data Science, Data Science in Quantitative Finance
            </p>
          </div>
          <div className="border-l-4 border-purple-600 dark:border-purple-400 pl-4">
            <h3 className="font-semibold text-lg">Bachelor of Engineering in Computer Engineering</h3>
            <p className="text-slate-600 dark:text-slate-400">National University of Singapore</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">August 2022 - July 2025</p>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              First Class Honours | Engineering Scholarship Programme | LifeHack'23 Project Director
            </p>
          </div>

          <div className="border-l-4 border-purple-600 dark:border-purple-400 pl-4">
            <h3 className="font-semibold text-lg">A Levels</h3>
            <p className="text-slate-600 dark:text-slate-400">Hwa Chong Institution</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">January 2014 - December 2019</p>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Infocomm Club | Students&apos;s Council | Volunteering
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold">Experience Highlights</h2>
        </div>
        <div className="space-y-6">

          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
            {/* <div className="flex justify-between items-start mb-2"> */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-2 gap-1">
              <h3 className="font-semibold text-lg">AI Engineer Intern</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">Sep 2025 - Present</span>
            </div>
            <p className="text-blue-600 dark:text-blue-400 mb-3">NUS Office of Internal Audit</p>
            <p className="text-slate-700 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400">→</span>
              <span> PDF Tampering detection using OCR, similarity analysis, metadata forensics and pdf xref structure analysis</span> <br></br>
              <span className="text-blue-600 dark:text-blue-400">→</span>
              <span> Research on detecting AI-generated receipts generated using unified multimodal LLMs (e.g. Gemini, ChatGPT)</span>
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
            {/* <div className="flex justify-between items-start mb-2"> */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-2 gap-1">
              <h3 className="font-semibold text-lg">Machine Learning Engineer Intern</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">May - Aug 2025</span>
            </div>
            <p className="text-blue-600 dark:text-blue-400 mb-3">Changi Airport Group</p>
            <p className="text-slate-700 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400">→</span>
              <span> Taxi demand forecasting using XGBoost</span> <br></br>
              <span className="text-blue-600 dark:text-blue-400">→</span>
              <span> Aircraft arrival and departure data analysis</span> <br></br>
              <span className="text-blue-600 dark:text-blue-400">→</span>
              <span> Automated data cleaning pipelines on AWS </span> <br></br>
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-2 gap-1">
              <h3 className="font-semibold text-lg">Computer Vision Research Assistant</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">Jan - May 2025</span>
            </div>
            <p className="text-blue-600 dark:text-blue-400 mb-3">Cisco-NUS Accelerated Digital Economy Lab</p>
            <p className="text-slate-700 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400">→</span>
              <span> DEEPSort + YOLOv8 for real-time human tracking from overhead fisheye camera</span> <br></br>
              <span className="text-blue-600 dark:text-blue-400">→</span>
              <span> Data pipeline for low-latency bounding box streaming in digital twinning applications</span> <br></br>
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
            {/* <div className="flex justify-between items-start mb-2"> */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-2 gap-1">
              <h3 className="font-semibold text-lg">AI & Computer Vision Engineer Intern</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">Jan - Jun 2024</span>
            </div>
            <p className="text-blue-600 dark:text-blue-400 mb-3">Rockship (NUS Overseas College Vietnam)</p>
            <p className="text-slate-700 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400">→</span>
              <span> RAG pipeline with Langchain ingesting 50+ n8n workflows for n8n node & workflow generation</span> <br></br>
              <span className="text-blue-600 dark:text-blue-400">→</span>
              <span> Boilerplate internal tooling for scalable LlamaIndex RAG APIs</span> <br></br>
              <span className="text-blue-600 dark:text-blue-400">→</span>
              <span> YOLOv8 object detection to detect nails on wall and check alignment</span> <br></br>
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-2 gap-1">
              <h3 className="font-semibold text-lg">Robotics Engineer Intern</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">May - July 2023</span>
            </div>
            <p className="text-blue-600 dark:text-blue-400 mb-3">DSTA Land Systems</p>
            <p className="text-slate-700 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400">→</span>
              <span> Implemented the state-of-the-art RTAB-Map Visual SLAM algorithm on DJI RoboMaster to enable real-time mapping and localization for reconnaissance missions.</span> <br></br>
              <span className="text-blue-600 dark:text-blue-400">→</span>
              <span> Designed a scalable multi-robot framework that force-multiplies robotic capabilities by integrating robots with a central platform via ROS and MQTT.</span> <br></br>
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <Heart className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold">Skillset</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Programming & Web</h3>
            <ul className="text-sm text-slate-700 dark:text-slate-300 list-disc list-inside space-y-1">
              <li>Python</li>
              <li>C, C++</li>
              <li>TypeScript</li>
              <li>Next.js</li>
              <li>FastAPI</li>
            </ul>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">AI & Machine Learning</h3>
            <ul className="text-sm text-slate-700 dark:text-slate-300 list-disc list-inside space-y-1">
              <li>PyTorch</li>
              <li>TensorFlow</li>
              <li>NLP / LLMs</li>
              <li>Image / Video Gen</li>
              <li>LangChain / LlamaIndex</li>
            </ul>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Data & Cloud</h3>
            <ul className="text-sm text-slate-700 dark:text-slate-300 list-disc list-inside space-y-1">
              <li>MySQL</li>
              <li>MongoDB</li>
              <li>Tableau</li>
              <li>AWS</li>
              <li>GCP</li>
            </ul>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">DevOps & Others</h3>
            <ul className="text-sm text-slate-700 dark:text-slate-300 list-disc list-inside space-y-1">
              <li>Docker</li>
              <li>GitHub Actions</li>
              <li>Git</li>
              <li>Computer Networks</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-semibold mb-3">Open to Collaboration</h2>
        <p className="text-slate-700 dark:text-slate-300">
          I&apos;m always excited to collaborate on AI-related applications, especially those involving LLMs, computer vision, 
          or solving real-world problems with machine learning. Feel free to reach out!
        </p>
      </section>
    </div>
  );
}