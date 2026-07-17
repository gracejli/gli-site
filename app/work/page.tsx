"use client";

import WorkSections from "@/components/WorkSections";
import { ShootingStarCursor } from "@/components/shooting-star-cursor";
import {
  visitorShort,
  visitorLong,
  myArchivesCollections,
  myHands,
} from "@/content/projects/data";

const SECTIONS = [
  {
    key: "visitorShort" as const,
    label: "fun for anyone visiting (5-10 mins)",
    projects: visitorShort,
  },
  {
    key: "visitorLong" as const,
    label: "and if you have more time (10+ mins)",
    projects: visitorLong,
  },
  {
    key: "archives" as const,
    label: "my personal archives, collections",
    projects: myArchivesCollections,
  },
  {
    key: "hands" as const,
    label: "my hands",
    projects: myHands,
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
