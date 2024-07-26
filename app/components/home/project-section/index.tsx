import React from "react";
import ProjectCard from "../../project-card";

const ProjectsSection = () => {
  return (
    <>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-2xl font-bold m-3 my-8 flex">
        <p id="projects" className="mx-auto justify-center p-3 underline">
          PROJECTS & HACKATHONS
        </p>
      </div>
      <div className="flex flex-col items-center space-y-5 lg:mx-auto lg:w-[70%]">
        <ProjectCard
          name="LLM Phishing Email Checker Extension"
          image="/LLMchecker.png"
          description="As part of the AISG: National AI Student Challenge 2024. Google Chrome extension which side-panel interface serves as the frontend of our LLM-powered phishing email checker application. This extension fetches Gmail messages from a specified Google account using the Gmail API and delivers them to our GPT-3.5-turbo backend server for analysis. Once a potential fraud is detected by the backend, the warning is sent back to the extension frontend to be delivered on the interface. Users may then exercise caution when reading these emails in their inbox as well as learn of phishing email characteristics."
          period="FEB 2024 - MAY 2024"
          url="https://learn.aisingapore.org/naisc2024/"
          repoUrl="https://github.com/aisg-2024"
        />
        <ProjectCard
          name="Keysight Singapore Engineering Challenge 2023"
          image="/keysight2023.jpeg"
          description="Worked with a group of 4 to develop an Arduino-based robot with ESP32 module and Xbox controller to overcome a range of obstacles specified by the Keysight Team. Utilized pygames and TCP connection to port over controls from the native app to Xbox controller."
          period="JUN 2023 - AUG 2023"
          url="https://www.youtube.com/watch?v=U3-Jd4MtcOc"
          repoUrl="https://github.com/yeo-menghan/KSEC_2023"
        />
      </div>
    </>
  );
};

export default ProjectsSection;
