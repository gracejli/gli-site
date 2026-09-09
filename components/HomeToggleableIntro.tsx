"use client";

import Link from "next/link";
import { GUESTBOOK_URL } from "@/content/backgroundVideos";

const textLinkClass =
  "underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]";

const iconLinkClass =
  "inline-flex items-center text-current transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]";

function ArenaIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 150.38 88.986"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M148.93 62.356l-20.847-16.384c-1.276-1-1.276-2.642 0-3.645l20.848-16.38c1.28-1.002 1.815-2.695 1.19-3.76-.626-1.062-2.374-1.44-3.88-.84l-24.79 9.874c-1.507.606-2.927-.22-3.153-1.83L114.57 2.926C114.34 1.317 113.13 0 111.877 0c-1.247 0-2.456 1.317-2.68 2.925l-3.73 26.467c-.228 1.61-1.646 2.434-3.155 1.83l-24.38-9.71c-1.512-.602-3.975-.602-5.483 0l-24.384 9.71c-1.508.604-2.928-.22-3.154-1.83L41.186 2.925C40.956 1.317 39.748 0 38.5 0c-1.252 0-2.463 1.317-2.688 2.925l-3.73 26.467c-.226 1.61-1.645 2.434-3.153 1.83L4.14 21.35c-1.507-.603-3.252-.223-3.878.838-.625 1.066-.092 2.76 1.184 3.76l20.85 16.38c1.277 1.003 1.277 2.645 0 3.646L1.446 62.356C.166 63.358-.364 65.152.26 66.34c.627 1.19 2.372 1.668 3.877 1.064l24.567-9.866c1.51-.603 2.914.218 3.125 1.828l3.544 26.696c.214 1.607 1.618 2.923 3.12 2.923 1.5 0 2.905-1.315 3.12-2.923l3.55-26.696c.21-1.61 1.62-2.43 3.122-1.828l24.164 9.698c1.506.606 3.97.606 5.477 0l24.16-9.698c1.504-.603 2.91.218 3.125 1.828l3.55 26.696c.212 1.607 1.617 2.923 3.115 2.923 1.502 0 2.907-1.315 3.12-2.923l3.55-26.696c.216-1.61 1.62-2.43 3.124-1.828l24.57 9.866c1.5.604 3.25.125 3.876-1.063.627-1.186.094-2.98-1.185-3.982zM95.89 46.18L77.53 60.315c-1.285.99-3.393.99-4.674 0L54.49 46.18c-1.284-.99-1.294-2.62-.02-3.625l18.4-14.493c1.274-1.005 3.363-1.005 4.638 0l18.4 14.493c1.277 1.004 1.267 2.634-.02 3.626z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export default function HomeToggleableIntro() {
  return (
    <div className="z-10 w-full max-w-4xl flex flex-col md:flex-row md:items-start gap-8 pointer-events-auto">
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
            welcome to my internet room. cheers, gli</p>
        </div>
      </div>

      <div className="w-full md:w-[40%] flex flex-col gap-4">
        <div className="p-8 border-2 border-dashed rounded-xl transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/5 bg-black/40 backdrop-blur">
          <h2 className="text-lg font-bold font-bianzhidai mb-4">external</h2>
          <div className="mb-4 flex items-center gap-3">
            <a
              href="https://www.are.na/gli/index"
              target="_blank"
              rel="noreferrer"
              aria-label="are.na"
              className={iconLinkClass}
            >
              <ArenaIcon className="h-4 w-auto" />
            </a>
            <a
              href="https://www.instagram.com/gli.site/"
              target="_blank"
              rel="noreferrer"
              aria-label="instagram"
              className={iconLinkClass}
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
          <ul className="space-y-2 font-fe text-sm font-bold">
            <li>
              <a
                href="https://docs.google.com/document/d/1WdBJDExZ1Qv5_9O9CWMckTeZ0aHClaSxNFT-jAPfEQk/edit?tab=t.0"
                target="_blank"
                rel="noreferrer"
                className={textLinkClass}
              >
                my google doc cv
              </a>
            </li>
            <li>
              <a
                href={GUESTBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className={textLinkClass}
              >
                guestbook
              </a>
            </li>
            <li>
              <Link href="/library?filter=favorites" className={textLinkClass}>
                bookshelf
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
