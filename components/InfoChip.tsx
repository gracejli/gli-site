"use client";

import ReactMarkdown from "react-markdown";

type AnchorProps = React.ComponentPropsWithoutRef<"a">;
type ParagraphProps = React.ComponentPropsWithoutRef<"p">;

const markdownComponents = {
  a: ({ href, children }: AnchorProps) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </a>
  ),
  p: ({ children }: ParagraphProps) => (
    <p className="mb-2 last:mb-0">{children}</p>
  ),
};

type InfoChipProps = {
  text: string;
  placement?: "above" | "below";
};

export default function InfoChip({
  text,
  placement = "above",
}: InfoChipProps) {
  const popupPosition =
    placement === "below"
      ? "top-7 right-0 -translate-y-1 group-hover:translate-y-0"
      : "bottom-7 right-0 translate-y-1 group-hover:translate-y-0";

  return (
    <div className="group relative flex h-6 w-6 items-center justify-center">
      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-amber-300/80 bg-black/70 text-[10px] font-fe text-amber-100 shadow-md transition group-hover:bg-amber-400/90 group-hover:text-black">
        i
      </div>
      <div
        className={`pointer-events-auto absolute ${popupPosition} w-52 rounded-lg border border-amber-200/60 bg-black/90 p-3 text-left text-[11px] font-fe leading-snug text-amber-50 opacity-0 shadow-xl backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100`}
      >
        <ReactMarkdown components={markdownComponents}>{text}</ReactMarkdown>
      </div>
    </div>
  );
}
