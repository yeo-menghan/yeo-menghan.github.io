import Link from "next/link";
import Workshop from "@/components/workshop/Workshop";
import { getContentByType } from "@/lib/content";

const selected = [
  {
    slug: "eKYC-facial",
    kind: "DEPLOYMENT · PROOF OF CONCEPT",
    title: "From a face to an inference.",
    description:
      "Facial liveness checks, a lean ONNX runtime, and an end-to-end AWS deployment. Including the security trade-offs.",
    visual: "vision",
    tags: "FastAPI / ONNX / AWS",
    number: "01",
  },
  {
    slug: "ippt-trainer",
    kind: "COMPUTER VISION · PERSONAL PROJECT",
    title: "A training partner that counts.",
    description:
      "A side-view pose tracker for push-ups and sit-ups. Built for my own IPPT training, with a laptop and a webcam.",
    visual: "pose",
    tags: "MediaPipe / OpenCV",
    number: "02",
  },
  {
    slug: "grain-project",
    kind: "SOFTWARE · TAKE-HOME EXPERIMENT",
    title: "Can an LLM plan a delivery?",
    description:
      "Driver–event allocation through iterative feedback. Exploring where structured evaluation helps, and where it falls short.",
    visual: "route",
    tags: "Python / LLM / Evaluation",
    number: "03",
  },
];
export default async function HomePage() {
  const projects = await getContentByType("projects");
  const available = selected.filter((item) =>
    projects.some((project) => project.slug === item.slug),
  );
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" />
            COMPUTER VISION ENGINEER · SINGAPORE
          </p>
          <h1>
            I build intelligence
            <br />
            for the <span>physical world.</span>
          </h1>
          <p className="hero-description">
            I’m Meng Han. I work at the intersection of computer vision, edge AI
            and robotics — turning pixels into systems that do something in the
            real world.
          </p>
          <div className="hero-actions">
            <Link href="/projects" className="button-primary">
              Explore my work <span>↗</span>
            </Link>
            <Link href="/about" className="text-link">
              A little about me <span>→</span>
            </Link>
          </div>
          <p className="hero-footnote">
            <span>01° 21′ N &nbsp; 103° 49′ E</span> Curious by default.
            Building to learn.
          </p>
        </div>
        <Workshop />
      </section>
      <div className="discipline-strip">
        <span>VISION → INFERENCE → ACTION</span>
        <p>
          Computer vision <i>/</i> Edge AI <i>/</i> Robotics <i>/</i> Creative
          code
        </p>
        <span aria-hidden="true">実験室 / THE WORKSHOP</span>
      </div>
      <section className="selected-work" aria-labelledby="selected-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / SELECTED WORK</p>
            <h2 id="selected-heading">Built. Tested. Learned.</h2>
          </div>
          <Link href="/projects" className="text-link">
            All projects <span>↗</span>
          </Link>
        </div>
        <div className="featured-grid">
          {available.map((item) => {
            const project = projects.find(
              (project) => project.slug === item.slug,
            )!;
            return (
              <Link
                href={`/projects/${item.slug}`}
                key={item.slug}
                className="featured-project"
              >
                <div
                  className={`project-visual ${item.visual}`}
                  aria-hidden="true"
                >
                  <span className="visual-label">
                    {item.number} / SYSTEM STUDY
                  </span>
                  {item.visual === "vision" ? (
                    <div className="face-target">
                      <span />
                      <i />
                      <b />
                    </div>
                  ) : item.visual === "pose" ? (
                    <svg viewBox="0 0 260 140">
                      <g fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="77" cy="43" r="9" />
                        <path d="M85 51L126 70 174 76 207 105M125 70L119 106 96 109M174 76L184 110 212 110" />
                      </g>
                      {[
                        [85, 51],
                        [126, 70],
                        [174, 76],
                        [119, 106],
                        [184, 110],
                      ].map(([x, y]) => (
                        <circle
                          key={x}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="currentColor"
                        />
                      ))}
                    </svg>
                  ) : (
                    <svg viewBox="0 0 260 140">
                      <path
                        d="M35 100L82 42 137 95 188 42 228 75"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeDasharray="5 5"
                      />
                      {[
                        [35, 100],
                        [82, 42],
                        [137, 95],
                        [188, 42],
                        [228, 75],
                      ].map(([x, y], i) => (
                        <g key={x}>
                          <circle
                            cx={x}
                            cy={y}
                            r="12"
                            fill="#102323"
                            stroke="currentColor"
                          />
                          <text
                            x={x}
                            y={y + 4}
                            textAnchor="middle"
                            fontSize="10"
                            fill="currentColor"
                          >
                            {i + 1}
                          </text>
                        </g>
                      ))}
                    </svg>
                  )}
                  <span className="visual-tech">{item.tags}</span>
                  <span className="visual-arrow">↗</span>
                </div>
                <div className="project-copy">
                  <p className="eyebrow">{item.kind}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="case-link">
                    Read {project.title} <span>↗</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="about-teaser">
        <p className="eyebrow">02 / ALWAYS IN PROGRESS</p>
        <div>
          <h2>
            Engineer by work.
            <br />
            <span>Tinkerer by nature.</span>
          </h2>
          <p>
            My work focuses on computer vision and deployed software. Outside of
            that, I’m learning electronics and exploring edge AI — one
            experiment, loose wire and debugging session at a time.
          </p>
          <Link href="/about" className="text-link">
            The person behind the projects →
          </Link>
        </div>
        <div className="teaser-note">
          <span>ON MY WORKBENCH</span>
          <p>
            Robotics. Drones.
            <br />
            Electronics. New ideas.
          </p>
          <Link href="/notes">Open the notebook ↗</Link>
        </div>
      </section>
      <section className="contact-section">
        <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
        <h2>
          Let’s build something
          <br />
          that leaves the screen.
        </h2>
        <a href="mailto:yeomenghan1989@gmail.com" className="text-link">
          yeomenghan1989@gmail.com ↗
        </a>
      </section>
    </>
  );
}
