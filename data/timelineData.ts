// data/timelineData.ts

export const experiences = [
  {
    id: 'nus-audit',
    company: 'NUS Office of Internal Audit',
    role: 'AI Engineer Intern',
    period: 'Sep 2025 – Present',
    bullets: [
      'Built an end-to-end fraud detection system for vendor invoices using OCR, PDF forensics, and document similarity - cut manual audit time by ~30%.',
      'Designed an explainable unsupervised anomaly detector (Isolation Forest + SHAP) to flag suspicious claims without labeled fraud data.'
    ],
    logoUrl: 'nus_oia_logo.jpeg',
    projectBadges: []
  },
  {
    id: 'changi-airport',
    company: 'Changi Airport Group',
    role: 'Machine Learning Engineer Intern',
    period: 'May 2025 – Aug 2025',
    bullets: [
      'Boosted taxi demand forecasting accuracy from 48% to 62% at Terminal 3 using XGBoost with time-series feature engineering.',
      'Automated flight turnaround analysis across 18k+ records to identify ground-crew bottlenecks and reduce departure delays',
      'Slashed monthly data pipeline runtime from 12h to 8.5h via a SageMaker-based ETL system with enhanced logging.'
    ],
    logoUrl: 'cag.png',
    projectBadges: []
  },
  {
    id: 'cisco',
    company: 'Cisco-NUS Accelerated Digital Economy Corporate Laboratory',
    role: 'Research Assistant',
    period: 'Jan 2025 – May 2025',
    bullets: [
        'Built a real-time human detection and tracking system using YOLOv8 + DeepSORT on overhead fisheye video feeds, achieving 84% mAP at 15 FPS on a standard workstation.',
        'Developed a low-latency pipeline to convert calibrated video streams into standardised JSON bounding boxes, enabling near real-time motion analysis for digital-twin applications.'
    ],
    logoUrl: 'cisco.jpeg',
    projectBadges: []
  },
  {
    id: 'rockship',
    company: 'Rockship (NUS Overseas College, Vietnam)',
    role: 'AI / Computer Vision Engineer Intern',
    period: 'Jan 2024 – June 2024',
    bullets: [
      'Created a RAG system (LangChain + LlamaIndex) that ingests 50+ n8n workflows to auto-generate new workflows',
      'Developed and deployed robust, scalable LlamaIndex RAG APIs for text and image embedding with built-in OCR safeguards, adopted as boilerplate by internal engineering team to accelerate prototype development',
      'Improved YOLOv8 nail detection mAP by 20pp via targeted labeling; integrated into an ARKit iOS app for sub-centimeter construction alignment',
    ],
    logoUrl: 'rockship.png',
    projectBadges: []
  }
];

export const educations = [
  {
    id: 'nus-msc',
    school: 'National University of Singapore',
    degree: 'Master of Science in Data Science & Machine Learning',
    period: 'Aug 2025 – Present',
    bullets: [
      'Relevant Coursework: Scalable Distributed Computing, Deep Learning, Optimisation Algorithms, Cloud Computing',
      'Expected Graduation: December 2026'
    ],
    logoUrl: 'nus-logo.jpg',
    projectBadges: []
  },
  {
    id: 'nus-beng',
    school: 'National University of Singapore',
    degree: 'Bachelor of Engineering in Computer Engineering',
    period: 'Aug 2022 – Jul 2025',
    bullets: [
      'First Class Honours | Engineering Scholarship Programme',
      'Project Director, LifeHack’23 | Photographer & Videographer, Freshmen Orientation 2023'
    ],
    logoUrl: 'nus-logo.jpg',
    projectBadges: []
  },
  {
    id: 'jc',
    school: 'Hwa Chong Institution',
    degree: 'A Levels',
    period: 'Jan 2014 – Dec 2019',
    bullets: [
      'Infocomm Club (Robotics) | Students’ Council | Volunteering',
    ],
    logoUrl: 'hc.jpeg',
    projectBadges: []
  }
];