"use client";

import Image from "next/image";
import Link from "next/link";

type Project = {
  id: number;
  title: string;
  desc: string;
  img?: string;
  link?: string; // full URL or path
  newTab?: boolean; // open link in a new tab
};

export default function ProjectItem({ project }: { project: Project }) {
  const href = project.link;

  const content = (
    <div className="flex gap-4 mb-6 group cursor-pointer items-start">
      <div className="w-12 h-12 border-2 border-dashed border-[#e6dfa8] flex-shrink-0 overflow-hidden rounded-xl">
        {project.img && (
          <Image
            src={project.img}
            alt={project.title}
            width={48}
            height={48}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        )}
      </div>
      <div>
        <h3 className="font-fe font-bold underline underline-offset-4 leading-tight transition-all duration-200 group-hover:text-white group-hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]">
          {project.title}
        </h3>
        <p className="text-sm mt-0.5 font-fe font-bold opacity-80">{project.desc}</p>
      </div>
    </div>
  );

  if (href) {
    const isExternal = project.newTab === true;
    return (
      <Link
        href={href}
        {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {content}
      </Link>
    );
  }

  return (
    content
  );
}
