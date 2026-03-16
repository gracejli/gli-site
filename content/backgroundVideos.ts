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
  // {
  //   type: "file",
  //   src: "/videos/sample-room.mp4",
  //   caption: "a quiet evening in my los feliz room",
  // },
  {
    type: "youtube",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    caption: "a youtube memory that feels like late-night internet",
  },
  {
    type: "youtube",
    url: "https://youtu.be/l9wLJL_0NQ0",
    caption: "trip with the metro to LA in 2019",
  },
  {
    type: "youtube",
    url: "https://youtu.be/hufoS41ifnI",
    caption: "my dorm room in 2019",
  },
  {
    type: "youtube",
    url: "https://youtu.be/TixYismCp0U",
    caption: "3 am in an airbnb with friends",
  },
  {
    type: "youtube",
    url: "https://youtu.be/QfKiQ7uiS-w",
    caption: "my first frame by frame animation",
  },
  {
    type: "youtube",
    url: "https://youtu.be/F_qfGXidmDo",
    caption: "europe vacation with friends 2019",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/-h9Cfx43iGk",
    caption: "me surfing the web, after effects",
  }, 
  


];

