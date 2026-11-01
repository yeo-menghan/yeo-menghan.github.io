// Objects describe destinations; article content stays in Markdown / the CMS.
export const workshopObjects = [
  {
    id: "drone",
    name: "Drone",
    category: "Robotics & drones",
    href: "/about#experience",
    detail:
      "From visual SLAM on mobile robots to vision pipelines for drones. Read about my engineering experience.",
  },
  {
    id: "camera",
    name: "Camera",
    category: "Computer vision",
    href: "/projects/ippt-trainer",
    detail:
      "A webcam, pose landmarks and a personal reason to build: training for IPPT.",
  },
  {
    id: "edge",
    name: "Edge computer",
    category: "Deployment & optimisation",
    href: "/projects/eKYC-facial",
    detail:
      "A CPU-based facial liveness proof of concept, from ONNX inference to an AWS deployment.",
  },
  {
    id: "bench",
    name: "Workbench",
    category: "Electronics experiments",
    href: "/about",
    detail:
      "Electronics and ESP32 are learning interests. No finished hardware project is claimed here; get to know what I’m exploring.",
  },
  {
    id: "monitor",
    name: "Monitor",
    category: "Software projects",
    href: "/projects/grain-project",
    detail:
      "An LLM allocation experiment with deterministic evaluation and an iterative feedback loop.",
  },
  {
    id: "notebook",
    name: "Notebook",
    category: "Technical notes",
    href: "/notes",
    detail: "Notes on machine learning, papers and things I’m figuring out.",
  },
] as const;
export type WorkshopId = (typeof workshopObjects)[number]["id"];
