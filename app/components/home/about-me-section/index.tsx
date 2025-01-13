import React from "react";
import Image from "next/image";
import Socials from "../../socials";

const AboutMeSection = () => {
  return (
    <>
      <div id="about-me" className="flex flex-col lg:flex-row md:w-[70%] mt-3 items-center pt-10" style={{ scrollMarginTop: "100px" }}>
        <div className="lg:w-[50%]">
          <Image
            className="mx-auto rounded-md"
            src="/yeo-menghan.jpg"
            alt="Meng Han pic"
            width={280}
            height={280}
            priority
          />
        </div>
        <div className="p-3 lg:w-[80%] lg:mx-auto">
          <p className="text-4xl font-semibold">Hi, I&apos;m {" "}
            <span className="hover:bg-lime-500 hover:text-zinc-800 transition duration-300">Meng Han</span>
            </p>
          <p className="mt-3">
            I am a <span className="font-semibold">Final Year Computer Engineering Undergraduate</span>{" "}
            at the National University of Singapore (NUS) under the{" "}
            <a
              className="font-semibold underline"
              href="https://cde.nus.edu.sg/escholars/"
              target="_blank"
            >
              Engineering Scholars Program
            </a>
            !
            {/* . Currently, I am working as a{" "}
            <span className="font-semibold">AI Engineer Intern</span> at{" "}
            <a
              className="font-semibold underline"
              href="https://rockship.co/"
              target="_blank"
            >
              Rockship
            </a>
            , an AI-Powered Software Development IT Solutioning Company, as part of {" "}
            <a
              className="font-semibold underline"
              href="https://enterprise.nus.edu.sg/education-programmes/nus-overseas-colleges/programmes/our-noc-locations/vietnam/"
              target="_blank"
            >
              NOC Vietnam AY2023-24 Semester 2
            </a>
            . */}
          </p>
          <p className="mt-3">
            You can talk to me about{" "}
            <span className="font-bold">
              Computer Vision, Model-Fine-Tuning, GenAI, AI agents, Data Science, Software Engineering
            </span>{" "}
            and <span className="font-bold">Startups</span>.
          </p>
        </div>
      </div>
      <Socials />
    </>
  );
};

export default AboutMeSection;
