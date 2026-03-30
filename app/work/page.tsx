"use client";

import WorkSections from "@/components/WorkSections";
import { ShootingStarCursor } from "@/components/shooting-star-cursor";
import {
  myArchivesCollections,
  documents,
  myHands,
  gliVsWorld,
} from "@/content/projects/data";

const SECTIONS = [
  {
    key: "archives" as const,
    label: "my archives, collections",
    projects: myArchivesCollections,
  },
  {
    key: "hands" as const,
    label: "my hands",
    projects: myHands,
  },
  {
    key: "gliVsWorld" as const,
    label: "a few things at once",
    projects: gliVsWorld,
  },
  {
    key: "documentation" as const,
    label: "my eyes",
    projects: documents,
  },
] as const;

export default function WorkPage() {
  return (
    <>
      <ShootingStarCursor />
      <WorkSections sections={SECTIONS} />
    </>
  );
}
