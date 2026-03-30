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
    label: "gli VS world",
    projects: gliVsWorld,
  },
  {
    key: "documentation" as const,
    label: "documenting the world",
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
