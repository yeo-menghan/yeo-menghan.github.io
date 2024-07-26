import React from "react";
import Image from "next/image";

type ExperienceCardProps = {
  icon: string;
  company: string;
  role: string;
  period: string;
  image: string;
  url: string;
  location?: string;
  description?: string; // Adding an optional description prop
};

const ExperienceCard = ({
  icon,
  company,
  role,
  period,
  image,
  url,
  location,
  description,
}: ExperienceCardProps) => {
  return (
    <li className="mb-10 ms-6">
      <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
        <svg
          className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300"
          aria-hidden="true"
          xmlns={icon}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
        </svg>
      </span>
      <div className="flex flex-row p-3 border-2 border-black rounded-md mx-auto">
        <div className="mr-6">
          <p className="font-bold">{role}</p>
          <a
            className="text-md font-semibold underline"
            target="_blank"
            href={url}
          >
            {company}
          </a>
          <p className="flex flex-row gap-2">
            {period}{" "}
            <span className="hidden md:block">
              {location ? `(${location})` : ""}
            </span>
          </p>
          {description && <p className="text-base font-normal">{description}</p>}
        </div>
        <Image
          className="ml-auto rounded-md"
          src={image}
          alt="company logo"
          width={100}
          height={70}
          priority
        />
      </div>
    </li>
  );
};

export default ExperienceCard;
