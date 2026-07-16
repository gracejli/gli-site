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
    label: "fun for you as a visitor (5-10 mins)",
    projects: visitorShort,
  },
  {
    key: "visitorLong" as const,
    label: "fun for you as a visitor (10+ mins)",
    projects: visitorLong,
  },
  {
    key: "archives" as const,
    label: "fun for me - my personal archives (maybe you too)",
    projects: myArchivesCollections,
  },
  {
    key: "hands" as const,
    label: "things i made with my hands",
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
