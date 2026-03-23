/** CSS classes in `app/styling/globals.css` — one stable color per slot (red / blue / yellow). */
const TONES = [
  "gallery-image-skeleton-red",
  "gallery-image-skeleton-blue",
  "gallery-image-skeleton-yellow",
] as const;

export function skeletonToneClass(index: number): string {
  return TONES[index % 3];
}
