import React from "react";
import Socials from "../../socials";

const Footer = () => {
  return (
    <div className="flex flex-col font-mono border-t-2 border-t-slate-500 w-full bg-gray-400">
      <Socials />
      <div className="p-2 pb-4 text-center">
        Inspired by{" "}
        <a className="underline" href="https://github.com/SuveenE/suveene.github.io">
        Suveens&apos; template.
        </a>{" "}
      </div>
    </div>
  );
};

export default Footer;
