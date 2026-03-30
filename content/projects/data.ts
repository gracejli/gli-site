// Shared project data for /work and /all views
// Optional `link` is a full URL or path
// Optional `newTab` controls whether the link opens in a new tab

export const myArchivesCollections = [
  {
    id: 15,
    title: "gli are.na photo album",
    desc: "my are.na photo channels collection",
    img: "/images/gli-albums.png",
    link: "/arena-channels",
    newTab: false,
  },
  {
    id: 14,
    title: "2011 email sign off archive",
    desc: "real emails from 2009-2011, wishes and sign offs",
    img: "/images/email-signoffs.png",
    link: "/email-signoffs",
    newTab: false,
  },
  {
    id: 7,
    title: "my favorite pictures ever",
    desc: "my instagram archive of 7 years",
    img: "/images/gracejli.png",
    link: "https://www.instagram.com/gracejli/",
    newTab: true,
  },
];

export const myHands = [
  {
    id: 17,
    title: "painting of someone I love",
    desc: "made with art division, los angeles",
    link: "https://www.instagram.com/p/DSies2KEtne/",
    newTab: true,
    img: "/images/art/tag-painting.jpg",
  },
  {
    id: 11,
    title: "valentines day 2019",
    desc: "drawings of my friends for valentines day",
    link: "https://www.instagram.com/p/DVCZCkMEpsR/",
    newTab: true,
    img: "/images/valentines.png",
  },
  {
    id: 20,
    title: "observatory",
    desc: "my show at the Benton Gallery - 3 paintings and drawings",
    img: "/images/observatory.png",
    link: "https://gracejli.com/observatory",
    newTab: true,
  },
  {
    id: 10,
    title: "question mark keychain",
    desc: "laser cut at the octavia butler lab",
    img: "/images/keychain.png",
    link: "https://www.instagram.com/p/DUi_4raj6CH/?img_index=1",
    newTab: true,
  },
  {
    id: 12,
    title: "ceramic ear headphones",
    desc: "hand sculpted ceramic ears for headphone decoration",
    img: "/images/ceramic-headphones.png",
    link: "https://www.instagram.com/p/DSihKsqEu3N/?img_index=1",
    newTab: true,
  },
  {
    id: 9,
    title: "shiny objects syndrome",
    desc: "2d frame by frame animation",
    img: "/images/shiny-objects2.png",
    link: "/shiny-objects",
    hoverGif: "images/animation.gif",
    newTab: false,
  },
  {
    id: 16,
    title: "painted porcelain",
    desc: "cobalt underglaze on hand thrown porcelain",
    img: "/images/painted ceramics.png",
    link: "https://gracejli.com/ceramics",
    newTab: true,
  },
];

export const gliVsWorld = [
  { 
    id: 2,
    title: "12 hours in walmart",
    desc: "18 interviews from 8PM to 8AM in a walmart",
    img: "/images/12-hours.png",
    link: "/walmart",
    hoverGif: "images/12-hours.gif",
    newTab: false,
  },
    { 
    id: 8,
    title: "chinatown, los angeles during covid",
    desc: "interviews and photos of los angeles chinatown, the day my school announced we were leaving",
    img: "/images/chinatown.jpg",
    link: "https://gracejli.com/chinatown",
    newTab: true,
  },
  {
    id: 1,
    title: "triumvirate arena",
    desc: "self-made game engine, turn taking card game",
    img: "/images/triumvirate-arena.png",
    link: "/triumvirate",
    hoverGif: "images/triumvirate.gif",
    newTab: false,
  },
  {
    id: 10,
    title: "dorm room vr",
    desc: "vr experience of my dorm room during covid",
    img: "/images/oldenborg-room.png",
    link: "/dorm-room-vr",
    hoverGif: "images/dormRoom.gif",
    newTab: false,
  },
  {
    id: 4,
    title: "odins passage",
    desc: "a game made in unity: viking odyssey x flappy bird",
    img: "/images/odins-passage.png",
    link: "/odinspassage",
    hoverGif: "images/odins.gif",
    newTab: false,
  },
  {
    id: 5,
    title: "ghost town",
    desc: "story based game about someone who returns to their hometown",
    img: "/images/ghost-town2.png",
    link: "/ghost-town",
    newTab: false,
  },
];

export const documents = [
  {
    id: 1,
    title: "rubiks cubes",
    desc: "video:  lauterbrunnen, switzerland",
    img: "/images/rubiks-cubes.gif",
    link: "https://www.youtube.com/watch?v=F_qfGXidmDo",
    newTab: true,
  },
  { 
    id: 2,
    title: "back home now",
    desc: "video: san diego, covid semester",
    img: "/images/san-diego.gif",
    link: "https://www.youtube.com/watch?v=V9Sbn4pKelg",
    newTab: true,
  },
  { 
    id: 5,
    title: "pigeon friend",
    desc: "video: trip with the metro to LA",
    img: "/images/pigeon-friend.gif",
    link: "https://www.youtube.com/watch?v=l9wLJL_0NQ0",
    newTab: true,
  },
  {
    id: 7,
    title: "my favorite pictures ever",
    desc: "my instagram archive of 7 years",
    img: "/images/gracejli.png",
    link: "https://www.instagram.com/gracejli/",
    newTab: true,
  },

];

export function workProjectKey(
  section: "archives" | "hands" | "gliVsWorld" | "documentation",
  id: number
) {
  return `${section}-${id}`;
}
