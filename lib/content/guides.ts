export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  intro: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
}

export const guideArticles: GuideArticle[] = [
  {
    slug: 'first-nyc-open-mic',
    title: 'Your First NYC Open Mic: What To Expect',
    description:
      'A practical guide for comedians doing their first open mic in New York City, from signup to stage time to post-set etiquette.',
    publishedAt: '2026-05-18',
    readingTime: '5 min read',
    category: 'Getting Started',
    intro:
      'Your first NYC mic usually feels more chaotic from the outside than it actually is. Once you know how signups, stage time, and room rules work, the night gets much less intimidating.',
    sections: [
      {
        heading: 'Show up earlier than you think you need to',
        paragraphs: [
          'A lot of mics are first come, first served or effectively reward the people who arrive early and check in fast. If the listing says signup starts at 6:30, treat that as the latest comfortable arrival time, not the moment to walk through the door.',
          'Early arrival also gives you time to find the host, understand the room, and avoid rushing straight from the sidewalk onto the stage.',
        ],
      },
      {
        heading: 'Know what kind of signup it is',
        paragraphs: [
          'NYC mics usually fall into a few buckets: in-person signup, online presignup, bucket draw, or a room where the host builds the list manually. The difference matters because it changes whether you should plan your whole night around one mic or stack multiple spots.',
          'If the listing mentions Instagram, a form, or an email address, confirm the process before you go. A lot of confusion comes from comics assuming every room works the same way.',
        ],
      },
      {
        heading: 'Expect short sets and uneven pacing',
        paragraphs: [
          'Most open mic sets are around three to five minutes. Some rooms move quickly. Others run late, pause for drink orders, or bunch comics together in ways that make the timing feel unpredictable.',
          'That is normal. Bring one tight short set, one even shorter version, and enough patience for a room that may not run exactly on schedule.',
        ],
      },
      {
        heading: 'Room etiquette matters more than beginners realize',
        paragraphs: [
          'Stay in the room, listen to other comics, and avoid treating the mic like a pure transaction. Hosts notice who supports the room and who disappears immediately after their set.',
          'If there is an item minimum or a drink requirement, plan for it. Fighting the room rules on principle rarely helps your night.',
        ],
      },
    ],
  },
  {
    slug: 'bringer-vs-signup-mics',
    title: 'Bringer Mics vs. Signup Mics, Explained',
    description:
      'How NYC bringer-style, presignup, and standard signup mics differ, and what each format is actually good for.',
    publishedAt: '2026-05-18',
    readingTime: '4 min read',
    category: 'Formats',
    intro:
      'Not every mic is trying to do the same job. Some are built for reps, some for social momentum, and some are closer to showcases with a mic label attached.',
    sections: [
      {
        heading: 'Signup mics are the basic reps engine',
        paragraphs: [
          'A normal signup mic is the most straightforward format: you sign up, wait your turn, do your time, and move on. These rooms are best when you need stage reps, want to test new material, or are still learning how different neighborhoods and crowds feel.',
          'The tradeoff is that quality and audience energy can vary a lot from room to room.',
        ],
      },
      {
        heading: 'Bringer or audience-driven rooms create a different incentive',
        paragraphs: [
          'Some rooms want you to bring people, buy items, or otherwise contribute to turnout. Those rooms may offer a stronger crowd, but the economics are different and the pressure is higher.',
          'That does not automatically make them bad. It just means you should treat them as a distinct format and decide whether the trade makes sense for your goals that night.',
        ],
      },
      {
        heading: 'Presignup rooms reward planning',
        paragraphs: [
          'Online forms, email lists, and Instagram signups are common in NYC. If you are organized, these rooms can be easier to chain together because you know earlier in the day whether you have a slot.',
          'The downside is that the rules can drift. Always confirm whether a room still wants day-of check-in or whether the online signup alone holds your spot.',
        ],
      },
    ],
  },
  {
    slug: 'best-mics-for-beginners',
    title: 'Best Open Mics for Absolute Beginners',
    description:
      'What makes an open mic beginner-friendly and how to spot rooms that are more forgiving when you are brand new.',
    publishedAt: '2026-05-18',
    readingTime: '4 min read',
    category: 'Getting Started',
    intro:
      'The best beginner mic is rarely the one with the coolest flyer. It is the one where the signup is clear, the expectations are legible, and you can actually settle your nerves enough to perform.',
    sections: [
      {
        heading: 'Look for clear signup rules',
        paragraphs: [
          'A room becomes much easier when you already know whether signup is online, at the door, or through Instagram. Ambiguity is stressful when you are new.',
          'If a listing tells you exactly when to arrive and what to do, that is usually a good sign.',
        ],
      },
      {
        heading: 'Favor rooms with predictable stage time',
        paragraphs: [
          'Three to five minute sets are ideal when you are starting. You get enough time to settle in, but not so much that one rough set derails your whole week.',
          'Rooms with wildly loose formatting can still be fun later, but they are often harder for a first-timer to read.',
        ],
      },
      {
        heading: 'Pick convenience over hype',
        paragraphs: [
          'A solid room near your train line that you will actually revisit is usually better than a famous room that turns one set into a three-hour ordeal. Consistency helps more than mythology.',
          'The goal of your first month is not to find the perfect room. It is to build a repeatable habit.',
        ],
      },
    ],
  },
  {
    slug: 'bar-mics-vs-coffee-shop-mics',
    title: 'Bar Mics vs. Coffee Shop Mics',
    description:
      'What changes between bar, club, theater, and coffee shop open mics in NYC, and how that affects your set.',
    publishedAt: '2026-05-18',
    readingTime: '4 min read',
    category: 'Rooms',
    intro:
      'Venue type changes the energy more than people expect. A comic doing the same material in a bar, club room, or cafe can feel like a different performer entirely.',
    sections: [
      {
        heading: 'Bar mics tend to be noisy and social',
        paragraphs: [
          'Bar rooms can be great for learning command, but they also force you to deal with side conversations, staff movement, and people who did not come specifically for comedy.',
          'That can make the room tougher, but it also teaches you quickly whether your opener gets attention.',
        ],
      },
      {
        heading: 'Coffee shop and bookstore style rooms often reward precision',
        paragraphs: [
          'These rooms can be quieter and more listening-oriented, which helps newer comics hear how their writing lands. The tradeoff is that a low-energy delivery can flatten out fast in a gentle room.',
          'If you want clean reps on new jokes, these spaces are often useful.',
        ],
      },
      {
        heading: 'Comedy clubs and black-box spaces often feel more structured',
        paragraphs: [
          'Club-adjacent rooms usually have clearer hosting, sharper transitions, and a stage setup that resembles a real show more closely than a casual bar room. That structure can help you practice pacing and mic technique.',
          'They can also be more transactional, with fees, item minimums, or stricter signup expectations.',
        ],
      },
    ],
  },
  {
    slug: 'open-mic-etiquette',
    title: 'Open Mic Etiquette: Do’s and Don’ts',
    description:
      'The unwritten rules of NYC open mics: support the room, respect hosts, and avoid the small habits that make a scene feel worse.',
    publishedAt: '2026-05-18',
    readingTime: '4 min read',
    category: 'Community',
    intro:
      'Most open mic etiquette is ordinary social awareness. The issue is that comedy scenes are small, people remember patterns, and careless behavior travels faster than good intentions.',
    sections: [
      {
        heading: 'Do support the room you are using',
        paragraphs: [
          'If the room has an item minimum, follow it. If the host asks comics to stay in the room, do that when you can. A mic survives because someone is paying in time, rent, labor, or credibility.',
          'You do not need to perform fake enthusiasm, but you do need to act like the room is not disposable.',
        ],
      },
      {
        heading: 'Do not make the signup harder for the host',
        paragraphs: [
          'Late arrivals, vague messages, and last-second bargaining over lineup position create unnecessary friction. Hosts are already juggling room timing, venue pressure, and a line of comics who all think their situation is special.',
          'Being easy to deal with will help you more than trying to game the list.',
        ],
      },
      {
        heading: 'Treat other comics like peers, not obstacles',
        paragraphs: [
          'Watch sets. Talk to people without angling immediately for a favor. The easiest way to become invisible in comedy is to interact only when you want something.',
          'Good scene habits compound quietly over time, and so do bad ones.',
        ],
      },
    ],
  },
];

export const guideArticleMap = Object.fromEntries(
  guideArticles.map((article) => [article.slug, article])
);
