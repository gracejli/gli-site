export type BackgroundVideoSource =
  | {
      type: "youtube";
      /** Full YouTube URL (e.g. https://youtu.be/... or https://www.youtube.com/watch?v=...) */
      url: string;
      caption: string;
    }
  | {
      type: "file";
      /** Path to a self-hosted video file in your public folder, e.g. /videos/room.mp4 */
      src: string;
      caption: string;
    };

// Edit this list to control which videos can play in the homepage background.
export const backgroundVideos: BackgroundVideoSource[] = [
  {
    type: "file",
    src: "/videos/sample-room.mp4",
    caption: "a quiet evening in my los feliz room",
  },
  {
    type: "youtube",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    caption: "a youtube memory that feels like late-night internet",
  },
];

