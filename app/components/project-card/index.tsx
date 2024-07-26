import React from "react";
import Image from "next/image";

type ExperienceCardprops = {
  name: string;
  description: string;
  period: string;
  image: string;
  url: string;
  repoUrl: string;
};

const ProjectCard = ({
  name,
  description,
  period,
  image,
  url,
  repoUrl,
}: ExperienceCardprops) => {
  return (
    <div className="max-w-4xl w-full border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mx-auto flex flex-col sm:flex-row">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 flex items-center justify-center p-4 sm:w-1/3"
      >
        <Image
          className="rounded-lg sm:rounded-l-lg sm:rounded-r-none"
          src={image}
          alt="project image"
          width={250}
          height={250}
          priority
        />
      </a>
      <div className="flex flex-col p-5 w-full">
        <a href={url} target="_blank" rel="noopener noreferrer">
          <h5 className="mb-2 text-xl sm:text-2xl font-bold tracking-tight text-white dark:text-white">
            {name}
          </h5>
        </a>
        <p className="mb-3 text-sm sm:text-base font-normal text-gray-300 dark:text-gray-400">
          {period}
        </p>
        <p className="flex-grow text-sm sm:text-base font-normal text-gray-400 dark:text-gray-400">
          {description}
        </p>
        <a
          href={repoUrl}
          className="block w-max px-4 py-2 mt-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="flex items-center">
            GitHub / Documentation
            <svg
              className="w-3 h-3 ml-2 rtl:rotate-180"
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
          </span>
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
