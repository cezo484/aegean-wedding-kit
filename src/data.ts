/**
 * The wedding, as data. Every template in this kit — the invitation email,
 * the RSVP page, the printable PDF invitation and the save-the-date card —
 * reads from this one file, so changing a time or a venue here changes it
 * everywhere. All names, people and places are fictional.
 */

export interface ScheduleItem {
  time: string;
  title: string;
  detail: string;
}

export interface TravelItem {
  title: string;
  body: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const wedding = {
  couple: {
    first: "Elena",
    second: "Deniz",
    firstFull: "Elena Marchetti",
    secondFull: "Deniz Kaya",
    monogram: "E · D",
  },
  date: {
    /** Saturday, 18 September 2027. */
    weekday: "Saturday",
    day: "18 September 2027",
    short: "18.09.2027",
    rsvpBy: "1 August 2027",
  },
  venue: {
    name: "The Olive House",
    garden: "Zeytinlik Garden",
    address: "Zeytinlik Garden, Alaçatı, Çeşme, İzmir, Türkiye",
    line: "The Olive House · Zeytinlik Garden, Alaçatı, Türkiye",
  },
  schedule: [
    { time: "17:00", title: "Ceremony", detail: "Beneath the olive trees in the garden" },
    { time: "18:00", title: "Cocktails", detail: "Sunset drinks on the stone terrace" },
    { time: "19:30", title: "Dinner", detail: "A long table under the lights" },
    { time: "21:00", title: "Dancing", detail: "Music until late, barefoot welcome" },
  ] as ScheduleItem[],
  travel: [
    {
      title: "Getting there",
      body: "Fly to İzmir Adnan Menderes Airport (ADB), about an hour's drive from Alaçatı. A shuttle runs on the day.",
    },
    {
      title: "Where to stay",
      body: "Rooms are held at three stone houses in the old town. Mention “Elena & Deniz” when you book, before 1 July.",
    },
    {
      title: "Things to do",
      body: "Windsurf in the morning, wander the stone streets at noon, and stay for the Saturday market.",
    },
  ] as TravelItem[],
  dressCode:
    "Garden formal — light fabrics and comfortable shoes. The ceremony is on the lawn, so flat shoes are a kind choice.",
  story: [
    "Elena and Deniz met on a September evening in Alaçatı, over a shared table at a stone house turned taverna. Deniz had come for the wind; Elena had come for the light. Neither of them left.",
    "Seven years later, they are getting married in the garden where it all began — under the olive trees, with the people they love most.",
  ],
  faq: [
    {
      question: "Can I bring a plus-one?",
      answer: "Your invitation names everyone we can seat. If a plus-one is included, their name is on your invitation.",
    },
    {
      question: "Is there a shuttle?",
      answer: "Yes — a shuttle runs from İzmir Adnan Menderes Airport (ADB) to Alaçatı at 15:00 on the day, and back to the hotels after midnight.",
    },
    {
      question: "What should I wear?",
      answer: "Garden formal: light fabrics and comfortable shoes. The ceremony is on the lawn, so flat shoes are a kind choice to your heels.",
    },
    {
      question: "Are children welcome?",
      answer: "We love your little ones, but the evening is adults only. Thank you for understanding.",
    },
  ] as FaqItem[],
  links: {
    /** Placeholder links: replace example.com with your own site. */
    home: "https://example.com/elena-deniz",
    story: "https://example.com/elena-deniz#story",
    schedule: "https://example.com/elena-deniz#schedule",
    venue: "https://example.com/elena-deniz#venue",
    travel: "https://example.com/elena-deniz#travel",
    rsvp: "https://example.com/rsvp",
    registry: "https://example.com/registry",
    map: "https://example.com/venue-map",
    instagram: "https://example.com/instagram",
    pinterest: "https://example.com/pinterest",
    email: "mailto:hello@example.com",
  },
} as const;

export type Wedding = typeof wedding;
