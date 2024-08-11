"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Header = () => {
  const [url, setUrl] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUrl(window.location.href);
  }, [router]);

  return (
    <div className="w-full flex flex-row justify-center bg-gray-400 sticky top-0 z-20 border-b-2 border-b-slate-500">
      <div className="flex flex-row gap-3 md:gap-6 font-mono text-xs md:text-base font-bold p-3 w-fit my-3 z-25 rounded-md  bg-gray-400 px-5">
        <a
          href="/#about-me"
          className={`cursor-pointer  border-black ${
            url.includes("/#about-me") ? "" : ""
          }hover:scale-110 text-center`}
        >
          About Me
        </a>
        <a
          href="/#experience"
          className={`cursor-pointer border-black ${
            url.includes("/#experience") ? " " : ""
          }hover:scale-110 text-center`}
        >
          Experience
        </a>
        <a
          href="/#projects"
          className={`cursor-pointer border-black ${
            url.includes("/#projects") ? "" : ""
          }hover:scale-110 text-center`}
        >
          Projects
        </a>
        <a
          href="/#other-stuff"
          className={`cursor-pointer border-black ${
            url.includes("/#other-stuff") ? "" : ""
          }hover:scale-110 text-center`}
        >
          Other Stuff
        </a>
        <a
          href="/thoughts"
          className={`cursor-pointer  border-black ${
            pathname.includes("/thoughts") ? "border-b-4 " : ""
          }hover:scale-110 text-center`}
        >
          Thoughts
        </a>
      </div>
    </div>
  );
};

export default Header;
