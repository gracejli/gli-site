/** On-site guestbook path. /guestbook redirects to Your World of Text. */
export const GUESTBOOK_URL = "/guestbook" as const;

/** External guestbook. Destination for the /guestbook redirect. */
export const GUESTBOOK_EXTERNAL_URL =
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
  {
    type: "youtube",
    url: "https://youtu.be/i8hK4p1BXvE", 
    caption: "5am sunrise on adeep sea fishing trip off the coast of long beach. caught a few scorpionfish, good for ceviche. 2026"
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/DYOOZajodk4",  
    caption: "still water at 6am on a deep sea fishing trip. wasn't too motion sick. 2026"
  }, 
  {
    type: "youtube", 
    url: "https://youtu.be/qLYAHA2LnrU", 
    caption: "on the last leg of the trans catalina hike, i was high up enough to see the clouds moving and changing right above me. 2026"
  }, 
  {
    type: "youtube",
    url:"https://youtu.be/2WEWdAYcQOY", 
    caption: "little harbor campground on the trans catalina hike. sparkling water, beach campsite. 2026"
  }, 
  {
    type: "youtube",
    url: "https://youtu.be/M6LR0KfOGo0", 
    caption: "night two at little harbor campground on the trans catalina trail backpacking. got to the site early, spent the rest of the day laying on the beach 2026"
  }, 
  {
    type: "youtube", 
    url: "https://youtu.be/UxWS7MBHxa0", 
    caption: "the rhythmic, hypnotic shadow of my trekking pole on my solo backpacking trip. catalina island, 2026" 
  }, 
  {
    type: "youtube", 
    url: "https://youtu.be/2T_uggX_VxQ", 
    caption: "wind blowing on the trans catalina trail 2026"
  },
  {
    type: "youtube",
    url: "https://youtu.be/GY7DzXnPKmc",
    caption: "free music event at barnsdall park in los angeles. thought the framing was nice. my last full day in LA before moving to NYC, 2026"
  },
  {
    type: "youtube",
    url: "https://youtu.be/BUgn-dvHLpw",
    caption: "geller + katz free music event at barnsdall park, one of my favorites 2026"
  },
  {
    type: "youtube",
    url: "https://youtu.be/nc1iyp4JBXs",
    caption: "my last sunset watch before moving to NYC, santa monica beach. 2026"
  },
  {
    type: "youtube",
    url: "https://youtu.be/mf_5TGU1bL0",
    caption: "rain, thunder, and lightning out my window in michigan. living out west you forget the rain can envelop an entire day 2026"
  },
  {
    type: "youtube",
    url: "https://youtu.be/5EzXhRuxSs0",
    caption: "bison in a protected area in the middle of denver. one of me and my brother's favorite sights in our cross country road trip 2026"
  },
  {
    type: "youtube",
    url: "https://youtu.be/U30kr3nQHz0",
    caption: "my friend's song playing amidst the red rocks of utah, cross country road trip with my brother 2026"
  },
  {
    type: "youtube",
    url: "https://youtu.be/yecrSC2hiJ4",
    caption: "LA sunset making the clouds glow as we descend, 2026"
  }
];

