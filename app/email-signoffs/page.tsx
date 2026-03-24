"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import { Mail, ChevronRight, Inbox, Loader2, AlertCircle } from "lucide-react";

const linkClass =
  "underline underline-offset-2 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]";

/** Inclusive range: Jan 1, 2009 through Dec 31, 2011 (local time). */
function randomDate2009to2011(): string {
  const start = new Date(2009, 0, 1).getTime();
  const end = new Date(2011, 11, 31, 23, 59, 59, 999).getTime();
  const t = start + Math.floor(Math.random() * (end - start + 1));
  return new Date(t).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type ArenaImageBlock = {
  class: string;
  title?: string | null;
  generated_title?: string | null;
  image?: {
    display?: { url?: string | null };
    original?: { url?: string | null };
    large?: { url?: string | null };
  };
};

type ArenaTextBlock = {
  class: string;
  content?: string | null;
  title?: string | null;
};

type SignOffItem =
  | { kind: "text"; text: string; displayDate: string }
  | { kind: "image"; src: string; alt: string; displayDate: string };

function signOffsFromArenaContents(contents: unknown[]): SignOffItem[] {
  const raw: SignOffItem[] = [];

  for (const block of contents) {
    if (!block || typeof block !== "object") continue;
    const b = block as ArenaTextBlock & ArenaImageBlock;
    const displayDate = randomDate2009to2011();

    if (b.class === "Text") {
      const text =
        (typeof b.content === "string" && b.content.trim()) ||
        (typeof b.title === "string" && b.title.trim()) ||
        "Untitled";
      raw.push({ kind: "text", text, displayDate });
      continue;
    }

    if (b.class === "Image") {
      const src =
        b.image?.display?.url ??
        b.image?.large?.url ??
        b.image?.original?.url ??
        "";
      if (!src) continue;
      const alt =
        (typeof b.title === "string" && b.title.trim()) ||
        (typeof b.generated_title === "string" && b.generated_title.trim()) ||
        "Image attachment";
      raw.push({ kind: "image", src, alt, displayDate });
    }
  }

  return shuffle(raw);
}

function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-signoffs-about-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-5 font-sans text-sm text-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="email-signoffs-about-title" className="font-semibold text-slate-900 mb-2">
          About
        </h2>
        <p className="leading-relaxed text-slate-600">
          these are real text and image blocks that I have from massive forwards and chains from the years of 2009-2011 when I was in elementary and middle school. 
          <br />
          <br />
          They are stored in my arena channel <a href="https://www.are.na/gli/2011-text-sign-offs" className={linkClass}>2011 text sign-offs</a>, 
          All of it feels like a memory. 
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function AboutButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 text-xs font-medium font-sans px-2.5 py-1.5 rounded-md bg-blue-600 text-white border border-blue-700 shadow-sm hover:bg-blue-700 transition-colors"
    >
      about
    </button>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white px-4 pt-12 pb-8 flex flex-col md:h-dvh md:max-h-dvh md:overflow-hidden">
      <nav className="text-md font-rasterGrotesk shrink-0 mb-8 max-w-6xl mx-auto w-full">
        <Link href="/" className={linkClass}>
          home
        </Link>
        <span className="opacity-90"> :: </span>
        <Link href="/work" className={linkClass}>
          work
        </Link>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  const [signOffs, setSignOffs] = useState<SignOffItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    const fetchArenaChannel = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.are.na/v2/channels/2011-text-sign-offs/contents?per=100",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch from Are.na");
        }

        const data: { contents?: unknown[] } = await response.json();
        const contents = Array.isArray(data.contents) ? data.contents : [];
        setSignOffs(signOffsFromArenaContents(contents));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Something went wrong");
        setLoading(false);
      }
    };

    fetchArenaChannel();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % signOffs.length);
  };

  // ---------------------------------------------------------------------------
  // Renders
  // ---------------------------------------------------------------------------

  const renderWindowControls = () => (
    <div className="flex gap-2 px-4 py-3 border-b border-slate-200 bg-slate-50 rounded-t-xl items-center">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
      </div>
      <div className="flex-1 text-center flex justify-center items-center text-xs font-medium text-slate-400">
        <Inbox className="w-3.5 h-3.5 mr-1" />
        Inbox - 2011 Sign-offs
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <PageShell>
          <div className="w-full max-w-2xl font-sans">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col min-h-[400px]">
              {renderWindowControls()}
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3 py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-sm font-medium">Connecting to server...</p>
              </div>
            </div>
          </div>
        </PageShell>
        <AboutButton onClick={() => setAboutOpen(true)} />
        <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      </>
    );
  }

  if (error || signOffs.length === 0) {
    return (
      <>
        <PageShell>
          <div className="w-full max-w-2xl font-sans">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col min-h-[400px]">
              {renderWindowControls()}
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-3 py-12">
                <AlertCircle className="w-8 h-8 text-red-400" />
                <p className="text-sm font-medium">
                  {error ? `Error: ${error}` : "No text or image blocks found in this channel."}
                </p>
              </div>
            </div>
          </div>
        </PageShell>
        <AboutButton onClick={() => setAboutOpen(true)} />
        <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      </>
    );
  }

  const current = signOffs[currentIndex];

  return (
    <>
      <PageShell>
      <div className="w-full max-w-2xl max-h-[min(85vh,720px)] min-h-0 font-sans">
        <div className="h-full max-h-[min(85vh,720px)] min-h-0 bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Top Window Bar */}
        {renderWindowControls()}

        {/* Scrollable: headers + body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {/* Email Metadata Headers */}
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col gap-3 text-sm">
            <div className="flex items-start">
              <span className="w-20 text-slate-400 font-medium select-none">From:</span>
              <span className="font-semibold text-slate-800">2011 Archives &lt;noreply@past.net&gt;</span>
            </div>
            <div className="flex items-start">
              <span className="w-20 text-slate-400 font-medium select-none">To:</span>
              <span className="text-slate-700">You &lt;reader@present.day&gt;</span>
            </div>
            <div className="flex items-start">
              <span className="w-20 text-slate-400 font-medium select-none">Date:</span>
              <span className="text-slate-700 flex items-center">{current.displayDate}</span>
            </div>
            <div className="flex items-start mt-2 pt-3 border-t border-slate-50">
              <span className="w-20 text-slate-400 font-medium select-none">Subject:</span>
              <span className="font-bold text-slate-900">Sign-off #{currentIndex + 1} of {signOffs.length}</span>
            </div>
          </div>

          {/* Email Body */}
          <div className="px-6 py-8 min-h-[240px] flex flex-col">
            {current.kind === "text" ? (
              <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">{current.text}</p>
            ) : (
              <figure className="m-0">
                <img
                  src={current.src}
                  alt={current.alt}
                  className="max-w-full h-auto rounded border border-slate-200"
                />
              </figure>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium select-none">
            <Mail className="w-3.5 h-3.5" />
            Message {currentIndex + 1} / {signOffs.length}
          </div>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next Message
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        </div>
      </div>
      </PageShell>
      <AboutButton onClick={() => setAboutOpen(true)} />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}