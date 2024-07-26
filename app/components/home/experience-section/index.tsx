import React from "react";
import ExperienceCard from "../../experience-card";

const ExperienceSection = () => {
  return (
    <>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-2xl font-bold m-3  my-8 flex">
        <p id="experience" className="mx-auto justify-center p-3 my-5 underline">
          EXPERIENCE
        </p>
      </div>
      <div className="items-center">
        <ol className="relative border-s border-gray-200 dark:border-gray-700">
          <ExperienceCard
            icon="http://www.w3.org/2000/svg"
            company="Rockship"
            role="AI Engineer Intern"
            period="2024 Jan - 2024 June"
            image="/rockship.png"
            url="https://rockship.co/"
            location="Ho Chi Minh City, Vietnam"
            description="Worked on AI models for natural language processing."
          />
          <ExperienceCard
            icon="http://www.w3.org/2000/svg"
            company="DSTA"
            role="Robotics Engineer Intern"
            period="2023 May - 2023 Jul"
            image="/dsta.jpg"
            url="https://www.dsta.gov.sg/"
            location="Singapore"
            description="Developed robotics solutions for defence applications."
          />
          <ExperienceCard
            icon="http://www.w3.org/2000/svg"
            company="Nat. University of Singapore"
            role="Undergraduate Research Opportunity Programme"
            period="2023 Aug - 2023 Dec"
            image="/nus-logo.jpg"
            url="https://www.comp.nus.edu.sg/programmes/ug/project/urop/"
            description="Conducted research on computer vision algorithms."
          />
          <ExperienceCard
            icon="http://www.w3.org/2000/svg"
            company="TaCo - Course Taster"
            role="Course Instructor"
            period="2023 Apr - 2023 May"
            image="/taco.jpeg"
            url="https://tastercourse.com/"
            description="Taught programming courses to beginners."
          />
          <ExperienceCard
            icon="http://www.w3.org/2000/svg"
            company="Oolong"
            role="Software Engineer Intern"
            period="2023 Jan - 2023 May"
            image="/oolong.png"
            url="https://oolong.app/"
            location="Remote"
            description="Built features for the mobile app using Laravel"
          />
          <ExperienceCard
            icon="http://www.w3.org/2000/svg"
            company="NUS Students' Computing Club"
            role="Project Director"
            period="2022 Dec - 2023 Jun"
            image="/nus-comp-club.jpeg"
            url="https://lifehack-23.devpost.com/"
            location="Singapore"
            description="Organised the Lifehack 2023 hackathon."
          />
        </ol>
      </div>
    </>
  );
};

export default ExperienceSection;
