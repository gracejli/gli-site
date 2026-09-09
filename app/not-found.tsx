import { ShootingStarCursor } from "@/components/shooting-star-cursor";
import { GUESTBOOK_URL } from "@/content/backgroundVideos";

export default function NotFound() {
  return (
    <>
      <ShootingStarCursor />
      <div className="flex min-h-[calc(100dvh-8rem)] items-center justify-center">
        <div className="w-full max-w-md p-8 border-2 border-dashed rounded-xl transition-all duration-300 hover:border-amber-400 hover:bg-amber-400/5 bg-black/40 backdrop-blur text-left">
          <p className="text-sm font-bold font-fe mb-2">sorry</p>
          <p className="text-sm font-bold font-fe mb-2">
            this page is not found, nothing here.
          </p>
          <p className="text-sm font-bold font-fe mt-4">
            but maybe soon, you could convince me.{" "}
            <br /><br />
            <a
              href={GUESTBOOK_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
            >
              guestbook
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
