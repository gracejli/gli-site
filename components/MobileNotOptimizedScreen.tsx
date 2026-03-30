export default function MobileNotOptimizedScreen() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--background)] p-8 text-center text-[var(--foreground)] md:hidden"
      aria-live="polite"
    >
      <p className="font-doto max-w-sm text-lg leading-relaxed whitespace-pre-line">
        {
          "this site is not optimized for mobile, sorry! i promise its better over there.\n\nwith love, gli"
        }
      </p>
    </div>
  );
}
