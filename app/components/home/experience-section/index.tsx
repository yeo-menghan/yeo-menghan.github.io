import React from "react";
import ExperienceCard from "../../experience-card";

const ExperienceSection = () => {
  return (
    <>
      <div className="z-10 w-full max-w-5xl mx-auto items-center justify-between font-mono text-2xl font-bold m-3 my-8 flex">
        <p id="experience"
        className="mx-auto justify-center p-3 my-5 underline">
          EXPERIENCE
        </p>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-full max-w-5xl">
          <ol className="relative border-s border-gray-200">
            <ExperienceCard
              company="Rockship, NOC Vietnam"
              role="AI / Computer Vision Engineer Intern"
              period="January 2024 - June 2024"
              image="/rockship.png"
              companyUrl="https://rockship.co/"
              blogUrl="https://yourblog.com/rockship-experience"
              location="Ho Chi Minh City, Vietnam"
              description="Worked on AI models for natural language processing."
            />
            <ExperienceCard
              company="DSTA"
              role="Robotics Engineer Intern"
              period="May 2023 - July 2023"
              image="/dsta.jpg"
              companyUrl="https://www.dsta.gov.sg/"
              blogUrl="https://yourblog.com/dsta-experience"
              location="Singapore"
              description="Developed robotics solutions for defence applications."
            />
            <ExperienceCard
              company="Nat. University of Singapore"
              role="Undergraduate Research Opportunity Programme"
              period="August 2023 - December 2023"
              image="/nus-logo.jpg"
              companyUrl="https://www.comp.nus.edu.sg/programmes/ug/project/urop/"
              blogUrl="https://yourblog.com/nus-urop-experience"
              description="Conducted research on computer vision algorithms for stairs detection."
            />
            <ExperienceCard
              company="TaCo - Course Taster"
              role="Course Instructor"
              period="April 2023 - May 2023"
              image="/taco.jpeg"
              companyUrl="https://tastercourse.com/"
              blogUrl="https://yourblog.com/taco-experience"
              description="Taught computer engineering courses to beginners."
            />
            <ExperienceCard
              company="Oolong"
              role="Software Engineer Intern"
              period="January 2023 - May 2023"
              image="/oolong.png"
              companyUrl="https://oolong.app/"
              blogUrl="https://yourblog.com/oolong-experience"
              location="Remote"
              description="Built features for the mobile app using Laravel."
            />
            <ExperienceCard
              company="NUS Students' Computing Club"
              role="Project Director"
              period="December 2022 - June 2023"
              image="/nus-comp-club.jpeg"
              companyUrl="https://lifehack-23.devpost.com/"
              blogUrl="https://yourblog.com/nus-comp-club-experience"
              location="Singapore"
              description="Organised the Lifehack 2023 hackathon."
            />
          </ol>
        </div>
      </div>
    </>
  );
};

export default ExperienceSection;
