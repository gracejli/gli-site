import Link from "next/link";

const resume = {
  displayName: "grace li",
  tagline: "short line about you",
  fullName: "Grace Li",
  /** Plain text line (e.g. obfuscated email). */
  contactLine: "gracejieyi @ gmail dot com",
  /** Optional: set href to enable; leave empty string to hide. */
  pdfHref: "" as string,
  /** Optional second nav link label + path. */
  siteLink: { label: "home", href: "/" as const },

  education: [
    {
      school: "Pomona College",
      entries: [
        {
          degree: "B.A in Computer Science",
          year: "2019-2023",
          detail: "minors in fine arts and media studies",
        },
      ],
    },
  ],

  /** Short paragraph above the job list (optional — use "" to hide). */
  experienceIntro:
    "A sentence or two on what your work focuses on, in your own voice.",

  experience: [
    {
      company: "Riot Gmaes",
      title: "technical artist II",
      dates: "jan '24 – pres",
      description:
        "What you did — one or more sentences. You can paste a short paragraph here.",
    },
    {
      company: "Microsoft",
      title: "software engineering intern",
      dates: "jun '20 – dec '23",
      description: "Another role description.",
    },
  ],

  /** Two (or more) skill groups — rendered as separate blocks. */
  skillGroups: [
    {
      label: "skills",
      items: [
        "design systems",
        "prototyping",
        "user research",
        "front-end development",
      ],
    },
    {
      label: "tools & stack",
      items: ["Figma", "React", "TypeScript", "Tailwind"],
    },
  ],
};

const linkClass =
  "underline underline-offset-2 transition-all duration-200 hover:text-[var(--story-link-hover)] hover:drop-shadow-[var(--story-link-glow)]";

export default function ResumePage() {
  return (
    <div className="max-w-xl mx-auto pb-16 font-fe text-[15px] leading-relaxed text-[var(--foreground)]">
      <header className="mb-12">
        <p className="font-rasterGrotesk text-xl tracking-tight mb-1">
          {resume.displayName}
        </p>
        <p className="opacity-90 mb-6">{resume.tagline}</p>
        <p className="mb-1">{resume.fullName}</p>
        <p className="opacity-90 mb-8">{resume.contactLine}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 font-rasterGrotesk text-sm">
          {resume.pdfHref ? (
            <a href={resume.pdfHref} className={linkClass} download>
              download pdf
            </a>
          ) : null}
          <Link href={resume.siteLink.href} className={linkClass}>
            {resume.siteLink.label}
          </Link>
        </div>
      </header>

      <section className="mb-14">
        <h2 className="font-rasterGrotesk text-sm uppercase tracking-[0.12em] mb-6">
          education
        </h2>
        {resume.education.map((block) => (
          <div key={block.school} className="mb-8 last:mb-0">
            <div className="font-rasterGrotesk mb-3">{block.school}</div>
            <ul className="space-y-4">
              {block.entries.map((e) => (
                <li key={`${e.degree}-${e.year}`}>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                    <span>{e.degree}</span>
                    <span className="opacity-60" aria-hidden>
                      •
                    </span>
                    <span className="opacity-90">{e.year}</span>
                  </div>
                  {e.detail ? (
                    <p className="mt-1 opacity-90">{e.detail}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mb-14">
        <h2 className="font-rasterGrotesk text-sm uppercase tracking-[0.12em] mb-6">
          experience
        </h2>
        {resume.experienceIntro ? (
          <p className="mb-8 opacity-95">{resume.experienceIntro}</p>
        ) : null}
        <div className="space-y-10">
          {resume.experience.map((job) => (
            <div key={`${job.company}-${job.dates}`}>
              <div className="font-rasterGrotesk mb-1">{job.company}</div>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0 mb-2">
                <span>{job.title}</span>
                <span className="opacity-60" aria-hidden>
                  •
                </span>
                <span className="opacity-90">{job.dates}</span>
              </div>
              <p className="opacity-95 whitespace-pre-line">{job.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-rasterGrotesk text-sm uppercase tracking-[0.12em] mb-6">
          skills
        </h2>
        <div className="space-y-6">
          {resume.skillGroups.map((group) => (
            <div key={group.label}>
              <p className="opacity-80 text-sm mb-2 capitalize">{group.label}</p>
              <p>{group.items.join(", ")}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
