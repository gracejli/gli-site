import type { ReactNode } from "react";

const linkClass =
  "underline underline-offset-2 transition-all duration-200 hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]";

type BlockProps = { children?: ReactNode };

type AnchorProps = BlockProps & { href?: string };

type ImgProps = { src?: string; alt?: string };

export const projectMdxComponents = {
  h1: ({ children }: BlockProps) => (
    <h1 className="text-2xl font-bold font-bianzhidai mb-4 mt-8 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }: BlockProps) => (
    <h2 className="text-lg font-bold font-bianzhidai mb-3 mt-8 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }: BlockProps) => (
    <h3 className="text-base font-bold font-fe mb-2 mt-6">{children}</h3>
  ),
  h4: ({ children }: BlockProps) => (
    <h4 className="text-sm font-bold font-fe mt-6 mb-2 text-amber-200/95 border-b border-dashed border-amber-200/35 pb-1 first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }: BlockProps) => (
    <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>
  ),
  a: ({ href, children }: AnchorProps) => (
    <a
      href={href}
      className={linkClass}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }: BlockProps) => (
    <ul className="list-disc ml-5 my-4 space-y-1">{children}</ul>
  ),
  ol: ({ children }: BlockProps) => (
    <ol className="list-decimal ml-5 my-4 space-y-1">{children}</ol>
  ),
  li: ({ children }: BlockProps) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }: BlockProps) => (
    <strong className="font-bold text-amber-100">{children}</strong>
  ),
  em: ({ children }: BlockProps) => (
    <em className="italic opacity-95">{children}</em>
  ),
  blockquote: ({ children }: BlockProps) => (
    <blockquote className="border-l-2 border-amber-200/50 pl-4 my-4 italic opacity-90">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-dashed border-amber-200/40" />,
  img: ({ src, alt }: ImgProps) =>
    src ? (
      <span className="block my-4 rounded-xl border-2 border-dashed border-[#e6dfa8]/30 overflow-hidden">
        <img
          src={src}
          alt={alt ?? ""}
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </span>
    ) : null,
};
