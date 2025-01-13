"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ClipboardIcon, CopyIcon } from "lucide-react";

const Socials = () => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText("yeo_menghan@u.nus.edu").then(
      () => {
        setCopied(true);
        toast.success("Email copied to clipboard! ✉️", {
          position: "bottom-right",
          duration: 3000,
        });
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      (err) => {
        console.log("failed to copy", err.mesage);
      }
    );
  };
  return (
    <>
      <div className="flex flex-row gap-5 mx-auto">
        <a
          href="https://github.com/yeo-menghan"
          className="group w-fit rounded-lg border border-transparent py-3 px-1 hover:scale-125"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="ml-auto rounded-md"
            src="/github-logo.png"
            alt="company logo"
            width={40}
            height={40}
            priority
          />
        </a>

        <a
          href="https://www.linkedin.com/in/yeo-meng-han/"
          className="group w-fit rounded-lg border border-transparent py-3 px-1 hover:scale-125"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="ml-auto rounded-md"
            src="/linkedin.png"
            alt="company logo"
            width={40}
            height={40}
            priority
          />{" "}
        </a>

        <a
          href="https://www.instagram.com/yeo_menghan/?hl=en"
          className="group w-fit rounded-lg border border-transparent py-3 px-1 hover:scale-125"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="ml-auto rounded-md"
            src="/instagram.png"
            alt="company logo"
            width={40}
            height={40}
            priority
          />{" "}
        </a>

      </div>
      <p
        className="text-sm inline-flex gap-1 items-center font-medium mx-auto p-1 px-2 text-gray-900 bg-white rounded-md cursor-pointer hover:bg-lime-500"
        onClick={(event) => {
          if (!copied){
            event.stopPropagation();
            copyToClipboard();
          }
        }}
      >
        yeomenghan1989@gmail.com <CopyIcon size={14} />
      </p>
    </>
  );
};

export default Socials;
