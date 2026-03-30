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
    <div className="relative max-w-3xl mx-auto">
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
          <details
            key={key}
            open={open[key]}
            onToggle={(e) => {
              const el =
                (e.currentTarget instanceof HTMLDetailsElement
                  ? e.currentTarget
                  : null) ??
                (e.target instanceof HTMLDetailsElement ? e.target : null);
              const nextOpen = el?.open;
              setOpen((prev) => ({
                ...prev,
                [key]: nextOpen !== undefined ? nextOpen : !prev[key],
              }));
            }}
            className="group/details border-b border-white/10 pb-6 last:border-b-0"
          >
            <summary className="cursor-pointer list-none flex items-baseline gap-2 font-fe text-lg font-bold text-[var(--foreground)] [&::-webkit-details-marker]:hidden">
              <span
                className="inline-block shrink-0 w-4 text-right transition-transform duration-200 group-open/details:rotate-90"
                aria-hidden
              >
                &gt;
              </span>
              <span className="underline underline-offset-4">{label}</span>
            </summary>
            <div className="mt-6 pl-6 border-l border-white/10">
              {projects.map((p) => (
                <ProjectItem key={workProjectKey(key, p.id)} project={p} />
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
