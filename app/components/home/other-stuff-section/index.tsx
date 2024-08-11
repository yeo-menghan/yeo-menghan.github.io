import React from "react";
import Image from "next/image";

const OtherStuffSection = () => {
  return (
    <>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-2xl font-bold m-3  my-8 flex">
        <p id="other-stuff" className="mx-auto justify-center p-3 underline">
          OTHER STUFF
        </p>
      </div>
      <div className="grid lg:w-[70%] grid-cols-1 lg:grid-cols-3 mx-auto gap-3 mb-10 items-center">
        <div className="flex flex-col my-auto justify-center gap-3">
          <div>
            <div className="flex flex-col p-3 w-fit border-2 border-white rounded-md">
              <div className="mx-auto items-center">
                  <div className="font-bold my-2 mx-auto text-center">
                    War History{"\n"}
                  </div>
                  <p className="mx-auto my-2 text-center">
                    War Documentaries are intriguing!
                  </p>
                </div>
                <Image
                  className="mx-auto md:mr-auto rounded-md max-h[260px] max-w[260px]"
                  src="/iwo-jima.webp"
                  alt="iwo-jima"
                  width={240}
                  height={240}
                  priority
                />
            </div>
          </div>
          <div>
            <div className="flex flex-col p-3 w-fit border-2 border-white rounded-md">
              <div className="mx-auto items-center">
                  <div className="font-bold my-2 mx-auto text-center">
                    E-Sports{"\n"}
                  </div>
                  <p className="mx-auto my-2 text-center">
                    I enjoy competitive games
                  </p>
                </div>
                <Image
                  className="mx-auto md:mr-auto rounded-md max-h[260px] max-w[260px]"
                  src="/faker.jpg"
                  alt="company logo"
                  width={260}
                  height={260}
                  priority
                />
            </div>
          </div>
        </div>
        <div className="md:ml-auto flex flex-col my-auto justify-center gap-3">
          <div className="flex flex-col p-3 w-72 border-2 border-white rounded-md mx-auto">
            <div className="mx-auto items-center">
              <div className="font-bold my-2 mx-auto text-center">
                I like to take PHOTOS!{"\n"}
              </div>
              <p className="mx-auto my-2 text-center">
                Follow my{" "}
                <a
                  href="https://www.instagram.com/mhsnap.s/"
                  target="_blank"
                  className="underline"
                >
                  instagram page
                </a>{" "}
                where I share some photos I take from my phone and my Sony ZV-E10.
              </p>
            </div>
            <Image
              className="mx-auto md:mr-auto rounded-md"
              src="/mhsnaps.png"
              alt="company logo"
              width={280}
              height={280}
              priority
            />
          </div>
        </div>
        <div className="flex flex-col my-auto justify-center gap-3">
          <div>
            <div className="flex flex-col p-3 w-fit border-2 border-white rounded-md mx-auto">
              <div className="mx-auto items-center">
                <div className="font-bold my-2 mx-auto text-center">
                  こんにちは!!! {"\n"}
                </div>
                <p className="mx-auto my-2 text-center">
                  I am trying to pick up the Japanese language!
                </p>
              </div>
              <a
                href="https://yeo-menghan.github.io/thoughts/japanese"
                target="_blank"
              >
                <Image
                  className="mx-auto md:mr-auto rounded-md max-h[240px] max-w[240px]"
                  src="/japanese.png"
                  alt="company logo"
                  width={240}
                  height={240}
                  priority
                />
              </a>
            </div>
          </div>
          <div>
            <div className="flex flex-col p-3 w-fit border-2 border-white rounded-md mx-auto">
              <div className="mx-auto items-center">
                  <div className="font-bold my-2 mx-auto text-center">
                    Anime!{"\n"}
                  </div>
                  <p className="mx-auto text-center my-2">
                    Read{" "}
                    <a
                      href="https://yeo-menghan.github.io/thoughts/anime"
                      target="_blank"
                      className="underline"
                    >
                      my anime recommendations
                    </a>
                  </p>
                </div>
                <Image
                  className="mx-auto md:mr-auto rounded-md max-h[240px] max-w[240px]"
                  src="/frieren.webp"
                  alt="frieren"
                  width={240}
                  height={240}
                  priority
                />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherStuffSection;
