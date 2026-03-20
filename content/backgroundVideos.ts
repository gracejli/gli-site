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
  // {
  //   type: "youtube",
  //   url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  //   caption: "gotchu",
  // },
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
  // {
  //   type: "youtube",
  //   url: "https://youtu.be/QfKiQ7uiS-w",
  //   caption: "my first frame by frame animation",
  // },
  {
    type: "youtube",
    url: "https://youtu.be/F_qfGXidmDo",
    caption: "europe vacation with friends 2019",
  }, 
  // {
  //   type: "youtube",
  //   url: "https://youtu.be/-h9Cfx43iGk",
  //   caption: "me surfing the web, after effects",
  // }, 
  {
    type: "youtube",
    url: "https://youtu.be/SEbpSf39JPE",
    caption: "2024, water in suzhou, china",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/si9kcZm_ZmI",
    caption: "2025, denali national park, alaska. friends climbing",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/x2Jg6jByzEU",
    caption: "2025, santa monica beach, los angeles",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/hbQvw1BF72I",
    caption: "2024, ducks in suzhou, china",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/iyWU5s4e8KU",
    caption: "2023, friends making dumplings together for thanksgiving",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/buhvRUvxwgw",
    caption: "2023, my friends practicing a script together",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/hF6H4SGM9Nk",
    caption: "waterfall in glacier national park 2024",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/Nk0AfxvaDqw",
    caption: "valentines day walk up to griffith observatory 2026",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/2Y3vybhcrV8",
    caption: "friends dancing, joshua tree np sunset 2025",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/YW-LZfFcix0",
    caption: "ping pong tournament 202r",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/fnD4IyY1g_c",
    caption: "los angeles beach at sunset, winter 2025",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/R1GvWHn5c6k",
    caption: "reeds near jiufen, taiwan 2024",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/jYIq5tWiHFo",
    caption: "afternoon storm at altitude, sequoia np 2024",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/ButztFk7Nnw",
    caption: "shadows dancing in the snow, sequoia np 2026",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/_KyN_yYVs90",
    caption: "summer lake sunset in michigan 2025",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/yq-J7mxiVzU",
    caption: "claremont, ca sunset, the semester I graduated 2023",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/jHdnmtyz5Ks",
    caption: "snowmelt water, sequoia 2026",
  }, 
];

