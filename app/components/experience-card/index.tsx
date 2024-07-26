import React from "react";
import Image from "next/image";

type ExperienceCardProps = {
  company: string;
  role: string;
  period: string;
  image: string;
  companyUrl: string;
  blogUrl: string;
  location?: string;
  description?: string;
};

const ExperienceCard = ({
  company,
  role,
  period,
  image,
  companyUrl,
  blogUrl,
  location,
  description,
}: ExperienceCardProps) => {
  return (
    <li className="mb-10 ms-4">
      <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
      <div className="flex justify-between items-center">
        <div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-300">
            {period}
          </time>
          <h3 className="text-lg font-semibold text-white">
            {role} at {company}
          </h3>
          {location && (
            <p className="mb-1 text-sm font-normal leading-none text-gray-300">
              {location}
            </p>
          )}
          {description && (
            <p className="mb-4 text-base font-normal text-gray-400">
              {description}
            </p>
          )}
          <a
            href={blogUrl}
            target="_blank"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            Learn more
            <svg
              className="w-3 h-3 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </a>
        </div>
        <div className="flex-shrink-0 ml-4">
          <a href={companyUrl} target="_blank">
            <Image
              src={image}
              alt={`${company} logo`}
              width={120}
              height={70}
              className="rounded-md"
            />
          </a>
        </div>
      </div>
    </li>
  );
};

export default ExperienceCard;
