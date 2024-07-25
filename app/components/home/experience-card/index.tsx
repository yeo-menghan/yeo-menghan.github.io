import React from "react";
import Image from "next/image";

type ExperienceCardprops = {
  company: string;
  role: string;
  period: string;
  image: string;
  url: string;
  location?: string
};

const ExperienceCard = ({
  company,
  role,
  period,
  image,
  url,
  location
}: ExperienceCardprops) => {
  return (
    <div>
      <div className="flex flex-row p-3 border-2 border-black rounded-md mx-auto">
        <div className="mr-6">
          <p className="font-bold">{role}</p>
          <a className="text-md font-semibold underline" target="_blank" href={url}>{company}</a>
          <p className="flex flex-row gap-2">{period} <span className="hidden md:block">{location? `(${location})`: ""}</span></p>
        </div>
        <Image
          className="ml-auto rounded-md"
          src={image}
          alt="company logo"
          width={70}
          height={70}
          priority
        />
      </div>
    </div>
  );
};

export default ExperienceCard;
