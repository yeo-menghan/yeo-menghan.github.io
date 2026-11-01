"use client";
import { Component, useCallback, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { workshopObjects, type WorkshopId } from "@/data/workshop";
const Scene = dynamic(() => import("./WorkshopScene"), {
  ssr: false,
  loading: () => (
    <p className="scene-loading" role="status">
      Preparing the workshop…
    </p>
  ),
});
export default function Workshop() {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<WorkshopId | null>(null);
  const handleError = useCallback(() => {
    setFailed(true);
    setLoaded(false);
  }, []);
  const object = workshopObjects.find((item) => item.id === selected);
  return (
    <section className="workshop" aria-label="Interactive rooftop workshop">
      <div className="workshop-top">
        <span>
          <i /> THE ROOFTOP LAB
        </span>
        <span>SG / AFTER HOURS</span>
      </div>
      <div className="scene-stage">
        <WorkshopIllustration />
        {loaded && !failed && (
          <SceneBoundary onError={handleError}>
            <Scene onSelect={setSelected} onError={handleError} />
          </SceneBoundary>
        )}
        {!loaded && (
          <div className="scene-invitation">
            <span className="scene-caption">
              A small space for big curiosities.
            </span>
            <button
              className="scene-enter"
              onClick={() => {
                setFailed(false);
                setLoaded(true);
              }}
            >
              {failed ? "Retry 3D workshop" : "Enter the 3D workshop"}{" "}
              <span>↗</span>
            </button>
            <span className="scene-small">
              {failed
                ? "3D unavailable. Explore using the objects below."
                : "Optional experience · loads on request"}
            </span>
          </div>
        )}
        {loaded && (
          <button className="scene-close" onClick={() => setLoaded(false)}>
            Exit 3D ×
          </button>
        )}
      </div>
      <div className="workshop-bottom">
        <span>
          {loaded
            ? "SELECT AN OBJECT TO EXPLORE"
            : "AN INTERACTIVE CORNER OF MY WORLD"}
        </span>
        <span>THREE.JS ↗</span>
      </div>
      <div className="object-links" aria-label="Workshop objects">
        {workshopObjects.map((item) => (
          <button
            key={item.id}
            aria-pressed={selected === item.id}
            onClick={() => setSelected(selected === item.id ? null : item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
      {object && (
        <div className="object-detail" aria-live="polite">
          <button
            className="detail-close"
            aria-label="Close object details"
            onClick={() => setSelected(null)}
          >
            ×
          </button>
          <span className="eyebrow">{object.category}</span>
          <p>{object.detail}</p>
          <Link href={object.href}>Explore {object.name.toLowerCase()} →</Link>
        </div>
      )}
      <noscript>
        <p>
          Explore the <a href="/projects">projects</a>,{" "}
          <a href="/about#experience">robotics experience</a> and{" "}
          <a href="/notes">technical notes</a> without 3D.
        </p>
      </noscript>
    </section>
  );
}
function WorkshopIllustration() {
  return (
    <svg
      className="workshop-illustration"
      viewBox="0 0 640 500"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x2="0" y2="1">
          <stop stopColor="#101c29" />
          <stop offset="1" stopColor="#27313b" />
        </linearGradient>
        <linearGradient id="roof" x2="1" y2="1">
          <stop stopColor="#354347" />
          <stop offset="1" stopColor="#182b30" />
        </linearGradient>
        <pattern
          id="windows"
          width="22"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <rect x="8" y="8" width="5" height="8" fill="#d4b88a" opacity=".35" />
        </pattern>
        <pattern
          id="floor"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          patternTransform="matrix(1 .3 -1 .3 320 150)"
        >
          <path d="M0 0H40V40" stroke="#749a9b" strokeOpacity=".17" />
        </pattern>
        <radialGradient id="halo">
          <stop stopColor="#69d8c4" stopOpacity=".15" />
          <stop offset="1" stopColor="#69d8c4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="500" fill="url(#sky)" />
      <circle cx="480" cy="89" r="29" fill="#a0c1be" opacity=".1" />
      <circle cx="480" cy="89" r="22" fill="#becbc4" opacity=".2" />
      {[
        [-10, 120, 60, 220],
        [54, 160, 54, 190],
        [111, 92, 45, 242],
        [161, 132, 65, 200],
        [239, 65, 55, 250],
        [301, 141, 38, 190],
        [347, 104, 60, 240],
        [420, 148, 50, 210],
        [491, 113, 55, 220],
        [557, 71, 70, 280],
        [615, 165, 45, 190],
      ].map(([x, y, w, h], i) => (
        <g key={x} opacity={i % 2 ? ".55" : ".8"}>
          <rect x={x} y={y} width={w} height={h} fill="#14212c" />
          <rect
            x={x + 4}
            y={y + 7}
            width={w - 8}
            height={h - 7}
            fill="url(#windows)"
          />
          <path d={`M${x + w / 2} ${y}v-18`} stroke="#384955" />
        </g>
      ))}
      <path d="M15 236L600 213M0 249L630 226" stroke="#3c4a53" />
      <rect x="566" y="116" width="19" height="70" rx="2" fill="#353742" />
      <text
        x="576"
        y="134"
        fill="#d59c98"
        fontSize="12"
        textAnchor="middle"
        style={{ writingMode: "vertical-rl" }}
      >
        夜の実験室
      </text>
      <circle cx="320" cy="290" r="230" fill="url(#halo)" />
      <path
        d="M65 318L330 210 598 324 326 455Z"
        fill="url(#roof)"
        stroke="#54706f"
      />
      <path
        d="M65 318L326 447 598 324V348L326 480 65 342Z"
        fill="#15252b"
        stroke="#41585c"
      />
      <path d="M65 318L330 210 598 324 326 455Z" fill="url(#floor)" />
      <path
        d="M70 315V269L330 166 591 277V320M70 289L330 185 591 296M330 166V210M175 228V272M486 232V277"
        stroke="#698282"
        strokeWidth="3"
      />
      <path
        d="M177 277V181L324 124 441 175V275L324 326Z"
        fill="#24383e"
        stroke="#62817e"
      />
      <path
        d="M177 181L324 124 441 175 295 235Z"
        fill="#37494a"
        stroke="#71857e"
      />
      <path
        d="M177 174L322 115 451 171 441 184 323 134 177 194Z"
        fill="#26383d"
        stroke="#607271"
      />
      <path d="M199 207L285 241V289L199 253Z" fill="#10282c" stroke="#507775" />
      <path d="M206 214L278 243V279L206 250Z" fill="#70d9c1" opacity=".2" />
      <path d="M224 219V256M254 232V269" stroke="#5b9f93" />
      <path d="M321 231L410 194V259L321 298Z" fill="#14272e" stroke="#58716f" />
      <path d="M339 231L396 208V249L339 274Z" fill="#183c40" stroke="#6ed8c2" />
      <path
        d="M350 234L384 221M350 243L371 234M350 252L389 237"
        stroke="#6ed8c2"
        opacity=".65"
      />
      <path d="M299 280L402 237 447 258 343 304Z" fill="#78938b" />
      <path
        d="M306 286V330M432 265V307M343 304V345"
        stroke="#9aab9c"
        strokeWidth="4"
      />
      <path d="M363 253V228L399 213V239Z" fill="#101e28" stroke="#69cbbb" />
      <path d="M370 230L391 222M370 237L385 231" stroke="#64cbb8" />
      <path
        d="M365 265L390 254 405 260 380 271Z"
        fill="#192d33"
        stroke="#54746d"
      />
      <path d="M412 248L428 241V254L413 261Z" fill="#284e4c" stroke="#7fae91" />
      <path d="M130 325L186 300 227 320 170 347Z" fill="#455d5c" />
      <path
        d="M130 325V350L170 372 227 343V320M170 347V372"
        fill="#253a3d"
        stroke="#607c75"
      />
      <path
        d="M144 329L181 314 209 325 173 342Z"
        fill="#173e3c"
        stroke="#749c7f"
      />
      <path d="M156 330L176 322 192 328 172 336Z" fill="#8aac7c" />
      <path d="M146 345L157 351" stroke="#dfa578" />
      <g stroke="#7ce0ce" strokeWidth="2">
        <path d="M452 327L519 297M457 301L514 327" />
        <ellipse cx="451" cy="327" rx="22" ry="7" />
        <ellipse cx="520" cy="297" rx="22" ry="7" />
        <ellipse cx="457" cy="301" rx="22" ry="7" />
        <ellipse cx="514" cy="327" rx="22" ry="7" />
        <path d="M473 309L486 302 500 311 486 320Z" fill="#77958b" />
        <path d="M481 319V330L493 324V316" />
      </g>
      <ellipse cx="487" cy="356" rx="47" ry="17" fill="#82dfcb" opacity=".06" />
      <path
        d="M444 362L487 343 534 363 489 384Z"
        stroke="#5a9b91"
        strokeDasharray="5 5"
      />
      <path d="M270 380L300 367 320 378 290 391Z" fill="#c5b799" />
      <path d="M290 371V389" stroke="#736e60" />
      <path
        d="M98 272V196M87 204L110 194M90 214L107 207"
        stroke="#7d918d"
        strokeWidth="2"
      />
      <path d="M102 199L136 184" stroke="#7ccfb9" />
      <text x="31" y="457" fill="#728c8f" fontSize="9" fontFamily="monospace">
        ROOFTOP / 001
      </text>
      <text x="467" y="457" fill="#728c8f" fontSize="9" fontFamily="monospace">
        VISION SYSTEMS LAB
      </text>
    </svg>
  );
}

// Network / chunk failures must also return visitors to the HTML experience.
class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
