"use client";

import { useState } from "react";

const MOBILE_WARNING_ACKNOWLEDGED_KEY = "gli-mobile-warning-acknowledged";

export default function MobileNotOptimizedScreen() {
  const [showAcknowledgement, setShowAcknowledgement] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    try {
      return localStorage.getItem(MOBILE_WARNING_ACKNOWLEDGED_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [isFinalConfirmation, setIsFinalConfirmation] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--background)] p-8 text-center text-[var(--foreground)] md:hidden"
      aria-live="polite"
    >
      <div className="flex max-w-sm flex-col items-center gap-6">
        <p className="font-doto text-lg leading-relaxed whitespace-pre-line">
          {
            "this site is not optimized for mobile, sorry! i promise its better over there.\n\nwith love, gli"
          }
        </p>

        <button
          type="button"
          onClick={() => setShowAcknowledgement(true)}
          className="font-fe text-sm italic text-amber-100 underline decoration-amber-300/80 underline-offset-4 transition hover:text-black"
        >
          I still want to see it
        </button>
      </div>

      {showAcknowledgement ? (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-warning-title"
        >
          <div className="w-full max-w-md rounded-xl border-2 border-dashed border-amber-300/80 bg-black/90 p-8 text-center shadow-xl transition-all">
            <p
              id="mobile-warning-title"
              className="mb-8 font-fe text-sm leading-relaxed text-amber-100/80"
            >
              ok I understand the risks and by clicking this I hereby acknowledge
              it is way better on desktop
            </p>

            <button
              type="button"
              onClick={() => {
                if (isFinalConfirmation) {
                  try {
                    localStorage.setItem(MOBILE_WARNING_ACKNOWLEDGED_KEY, "1");
                  } catch {
                    /* storage unavailable */
                  }
                  setDismissed(true);
                  return;
                }

                setIsFinalConfirmation(true);
              }}
              className="rounded-full border border-amber-300/70 bg-amber-400/20 px-5 py-3 text-xs font-fe font-bold uppercase tracking-wide text-amber-100 transition hover:bg-amber-400/80 hover:text-black"
            >
              {isFinalConfirmation ? "i promise" : "ok"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
