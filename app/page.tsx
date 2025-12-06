import { Briefcase, GraduationCap, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section>
        {/* <h1 className="text-4xl font-bold mb-4">Hi, I&apos;m Meng Han</h1> */}
        <h1 className="text-4xl font-bold mb-4">
          Hi, I&apos;m Meng Han <span className="inline-block animate-wave">👋</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
          Aspiring AI/ML Engineer passionate about building intelligent systems that solve real-world problems
        </p>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          I&apos;m currently pursuing a Master of Science in Data Science and Machine Learning at the National University of Singapore, 
          where I&apos;m deep-diving into the fascinating world of Big Data and Machine Learning Algorithms. With a background in 
          Computer Engineering and hands-on experience across machine learning, computer vision, and AI systems, I love turning 
          complex problems into elegant solutions.

          <br></br>
          <br></br>

          Outside of tech, I deeply enjoy cycling, photography, anime, gaming and exploring new parts of the world!
        </p>
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
            <p className="text-sm text-slate-500 dark:text-slate-500">July 2025 - Present</p>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              Relevant Coursework: Scalable Distributed Computing for Data Science, Data Science in Quantitative Finance
            </p>
          </div>
          <div className="border-l-4 border-purple-600 dark:border-purple-400 pl-4">
            <h3 className="font-semibold text-lg">Bachelor of Engineering in Computer Engineering</h3>
            <p className="text-slate-600 dark:text-slate-400">National University of Singapore</p>
            <p className="text-sm text-slate-500 dark:text-slate-500">August 2022 - July 2025</p>
            <p className="mt-2 text-slate-700 dark:text-slate-300">
              First Class Honours | GPA: 4.51/5.00 | Engineering Scholarship Programme
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
          <h2 className="text-2xl font-bold">What I&apos;m Working On</h2>
        </div>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Currently exploring the frontiers of AI through my graduate studies and personal ventures, with a particular focus on:
        </p>
        <ul className="space-y-2 text-slate-700 dark:text-slate-300">
          <li className="flex gap-2">
            <span className="text-blue-600 dark:text-blue-400">→</span>
            <span>Operating small local LLMs - RAG, fine-tuning, quantisation to optimise performance on limited compute</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 dark:text-blue-400">→</span>
            <span>Diffusion Models and their applications in generative AI (Stable Diffusion, LoRAs, Pose Estimation and VideoGen)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 dark:text-blue-400">→</span>
            <span>Scalable ML systems and distributed computing for data science using Apache Spark on GCP Dataproc</span>
          </li>
        </ul>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <Briefcase className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold">Experience Highlights</h2>
        </div>
        <div className="space-y-6">

          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">AI Engineer Intern</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">Sep 2025 - Present</span>
            </div>
            <p className="text-blue-600 dark:text-blue-400 mb-3">NUS Office of Internal Audit</p>
            <p className="text-slate-700 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400">→</span>
              <span> PDF Tampering detection using OCR, similarity analysis, metadata forensics and pdf xref structure analysis</span> <br></br>
              <span className="text-blue-600 dark:text-blue-400">→</span>
              <span> Research on detecting AI-generated receipts from unified multimodal LLMs</span>
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-2">
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
            <div className="flex justify-between items-start mb-2">
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
            <div className="flex justify-between items-start mb-2">
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
        </div>
      </section>

      {/* <section>
        <div className="flex items-center gap-2 mb-6">
          <Heart className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-bold">Interests</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Technical</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Deep learning architectures, LLMs, diffusion models, computer vision, and AI safety
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Beyond Code</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Cycling, photography, anime, gaming and exploring new parts of the world!
            </p>
          </div>
        </div>
      </section> */}

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