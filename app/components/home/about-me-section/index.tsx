import React from "react";
import Image from "next/image";

const AboutMeSection = () => {
  return (
    <>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-2xl font-bold m-3 mb-8 flex">
        <p id="about-me" className="mx-auto justify-center p-3 underline">
          ABOUT ME
        </p>
      </div>

      <div className="flex flex-col lg:flex-row md:w-[70%] mt-3 items-center">
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
          <p className="text-xl font-semibold">Hi, I&apos;m Meng Han</p>
          <p className="mt-3">
            I study <span className="font-semibold">Computer Engineering</span>{" "}
            at National University of Singapore as an{" "}
            <a
              className="font-semibold underline"
              href="https://cde.nus.edu.sg/escholars/"
              target="_blank"
            >
              Engineering Scholar
            </a>
            . Currently, I am working as a{" "}
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
            .
          </p>
          <p className="mt-3">
            You can talk to me about{" "}
            <span className="font-semibold">
              LLMs, Deep Learning, AI agents, Robotics, IoT, Software Engineering
            </span>{" "}
            and <span className="font-semibold">Startups</span>.
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutMeSection;
