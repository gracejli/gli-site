/** Guestbook (Your World of Text). Used by the homepage intro and the slow-down dialog. */
export const GUESTBOOK_URL =
  "https://www.yourworldoftext.com/%7Egracejli/" as const;

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
    url: "https://youtu.be/R1GvWHn5c6k",
    caption: "reeds near jiufen, taiwan 2024. trip with my mom",
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
    caption: "water in suzhou, china 2024",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/si9kcZm_ZmI",
    caption: "denali national park, 2024",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/x2Jg6jByzEU",
    caption: "santa monica beach, los angeles, 2024",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/hbQvw1BF72I",
    caption: "ducks in suzhou, china, 2024",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/iyWU5s4e8KU",
    caption: "my friends making dumplings together for thanksgiving, 2023",
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
    caption: "ping pong tournament 2026. I didn't win, by the way. I actually got 'bageled' and learned what that phrase meant on the same day",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/fnD4IyY1g_c",
    caption: "los angeles beach at sunset, winter 2025",
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
  {
    type: "youtube",
    url: "https://youtu.be/y90ObRbOSIk",
    caption: "my grandma's food spread, eating together for lunar new years in china 2024",
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/hivheuLxFFw",
    caption: "waterfall in shifen, taiwan 2024",
  },
  {
    type: "youtube",
    url: "https://youtu.be/pueyjnKea8o",
    caption: "houses on the top of a mountain in bødo, norway. hiked up with friends 2022",
  },
  {
    type: "youtube",
    url: "https://youtu.be/MbZzUFnj4qI",
    caption: "summer sunset in northern michigan, 2024",
  },
  {
    type: "youtube",
    url: "https://youtu.be/yw3lOSgjIR0",
    caption: "bird hiking on the W trek in patagonia national park, chile 2023",
  },
  {
    type: "youtube",
    url: "https://youtu.be/WxqpbttlyCo",
    caption: "friend biking in southern denmark, my semester abroad 2022",
  },
  {
    type: "youtube",
    url: "https://youtu.be/503tcLtsO9Y",
    caption: "family playing in san diego 2020",
  },
  {
    type: "youtube",
    url: "https://youtu.be/MvOidukurRw",
    caption: "still water in patagonia, chile 2023",
  },
  {
    type: "youtube",
    url: "https://youtu.be/87z-NSBJai4",
    caption: "my jumping caterpillar friend 2023",
  },
  {
    type: "youtube",
    url: "https://youtu.be/2-4_VKugB2A",
    caption: "water in glacier national park, 2023",
  },
  {
    type: "youtube",
    url: "https://youtu.be/ywgGKIV5LfU",
    caption: "my friends talking on the pier in lake tahoe, california",
  },
  {
    type: "youtube",
    url: "https://youtu.be/6PUlnsZ3GS4",
    caption: "sun peering through after the rain on a farm walk in costa rica",
  },
  {
    type: "youtube",
    url: "https://youtu.be/UFV-IRNa8e8",
    caption: "near saltstraumen in norway, 2022. study abroad semester",
  },
  {
    type: "youtube",
    url: "https://youtu.be/0yD9UF4C870",
    caption: "i led backpacking trips for middle schoolers in 2022 in the pacific northwest. hardest and most rewarding summer, ever.",
  },
  {
    type: "youtube",
    url: "https://youtu.be/AOP6kTJTQFU",
    caption: "san diego beach, 2020",
  },
  {
    type: "youtube",
    url: "https://youtu.be/Bqw-l1vc_Sg",
    caption:"sunset surfer in san diego. one of my favorite clips ever. 2020",
  },
  {
    type: "youtube",
    url: "https://youtu.be/WfMcU6Zycg4",
    caption: "mossy hike in norway. we tried to see the northern lights but it was cloudy. 2022",
  },
  {
    type: "youtube",
    url: "https://youtu.be/cssuqkJDj5U",
    caption: "saltstraumen, norway. two water densities fighting. 2022",
  },
  {
    type: "youtube",
    url: "https://youtu.be/ygg2AAxPCsU",
    caption: "peak of a hike, lunchtime sandwich 2022",
  },
  {
    type: "youtube",
    url: "https://youtu.be/DIyC_VjUbj4",
    caption: "friends looking at beautiful sunset in malaga, spain. study abroad 2022",
  },
  {
    type: "youtube",
    url: "https://youtu.be/_nJ4y4Tw4fs",
    caption: "new years moment 2025, along the la river!",
  },
  {
    type: "youtube",
    url: "https://youtu.be/iF8ZQWSVoAc",
    caption: "kayaking with my family in northern michigan 2025",
  },
  {
    type: "youtube",
    url: "https://youtu.be/nWIi2UKsyI0",
    caption: "bright morning in kenai fjords, alaska 2025. sorry about the dog barking, haha",
  },
];

