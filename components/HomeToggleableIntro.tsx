"use client";

export default function HomeToggleableIntro() {
  return (
    <div className="z-10 w-full max-w-4xl flex flex-col md:flex-row gap-8 pointer-events-auto">
      <div className="w-full md:w-[60%] flex flex-col gap-8">
        <div className="p-8 border-2 border-dashed rounded-xl transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/5 cursor-none text-left bg-black/40 backdrop-blur">
          <p className="text-lg font-bianzhidai mb-2">grace li</p>
          <p className="text-sm font-bold font-fe mb-2">
            tinkerer in los angeles, from a small town in michigan.
          </p>
          <p className="text-sm font-bold font-fe mb-2">
            currently: i'm a technical artist at riot games working on making the game
            teamfight tactics as delightul as possible for players
          </p>
          <p className="text-sm font-bold font-fe mb-2">
            previously: at microsoft and at columbia records. b.a. in computer science and
            art from pomona college
          </p>
          <p className="text-sm font-bold font-febold mt-4 ">
            welcome to my internet room
          </p>
        </div>
      </div>

      <div className="w-full md:w-[40%] flex flex-col h-full gap-4">
        <div className="h-full p-8 border-2 border-dashed rounded-xl transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/5 bg-black/40 backdrop-blur">
          <h2 className="text-lg font-bold font-bianzhidai mb-4">external</h2>
          <ul className="space-y-2 font-fe text-sm font-bold">
            <li>
              <a
                href="https://www.are.na/gli/index"
                className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
              >
                are.na
              </a>
            </li>
            <li>
              <a
                href="https://docs.google.com/document/d/1WdBJDExZ1Qv5_9O9CWMckTeZ0aHClaSxNFT-jAPfEQk/edit?tab=t.0"
                className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
              >
                my google doc cv
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/gracejli/"
                className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
              >
                some of my favorite photos
              </a>
            </li>
            <li>
              <a
                href="https://www.yourworldoftext.com/%7Egracejli/"
                className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
              >
                guestbook
              </a>
            </li>
            <li>
              <a
                href="https://www.gracejli.com"
                className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
              >
                my old, currently live project website
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
