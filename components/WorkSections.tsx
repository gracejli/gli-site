"use client";

import { useCallback, useState, type ComponentProps } from "react";
import { FoldVertical } from "lucide-react";
import ProjectItem from "@/components/ProjectItem";
import { workProjectKey } from "@/content/projects/data";

type WorkProject = NonNullable<ComponentProps<typeof ProjectItem>["project"]>;

export type WorkSectionConfig = {
  key: Parameters<typeof workProjectKey>[0];
  label: string;
  projects: WorkProject[];
};

export default function WorkSections({
  sections,
}: {
  sections: readonly WorkSectionConfig[];
}) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map((s) => [s.key, true]))
  );

  const collapseAll = useCallback(() => {
    setOpen(Object.fromEntries(sections.map((s) => [s.key, false])));
  }, [sections]);

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="flex justify-end mb-2 min-h-9">
        <button
          type="button"
          onClick={collapseAll}
          className="p-1.5 rounded text-[var(--foreground)] hover:text-white hover:drop-shadow-[0_0_6px_rgba(253,224,71,0.8)] transition-all duration-200"
          aria-label="Collapse all sections"
          title="Collapse all"
        >
          <FoldVertical className="size-5" strokeWidth={1.75} aria-hidden />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {sections.map(({ key, label, projects }) => (
          <div key={key} className="w-full">
            <button
              type="button"
              id={`work-section-trigger-${key}`}
              className="cursor-pointer list-none flex items-baseline gap-2 font-fe text-lg font-bold text-[var(--foreground)] w-full text-left focus:outline-none"
              onClick={() =>
                setOpen((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              aria-expanded={open[key]}
              aria-controls={`work-section-${key}`}
            >
              <span
                className={`inline-block shrink-0 w-4 text-right transition-transform duration-200 ${open[key] ? "rotate-90" : ""}`}
                aria-hidden
              >
                &gt;
              </span>
              <span className="underline underline-offset-4">{label}</span>
            </button>
            <div
              id={`work-section-${key}`}
              role="region"
              aria-labelledby={`work-section-trigger-${key}`}
              className={`
              overflow-hidden transition-all duration-300 ease-in-out w-full
              ${open[key] ? "opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}
            `}
            >
              <div className="pl-6">
                {projects.map((p) => (
                  <ProjectItem key={workProjectKey(key, p.id)} project={p} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
