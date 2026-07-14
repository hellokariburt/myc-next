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
    readingTime: '7 min read',
    category: 'Getting Started',
    intro:
      'Your first NYC mic usually feels more chaotic from the outside than it actually is. We track over 400 open mics a week across the city, and while every room has its own personality, the mechanics repeat: a signup, a list, a host running the list, and a line of comics doing five minutes each. Once you understand those mechanics, the night gets much less intimidating.',
    sections: [
      {
        heading: 'Show up earlier than you think you need to',
        paragraphs: [
          'Roughly a quarter of the mics we track are in-person signup, and most of those are first come, first served. Some rooms are explicit about it — Fear City on the Lower East Side tells you to arrive fifteen minutes before showtime, and the mics at Eastville Comedy Club in Downtown Brooklyn open their lists thirty minutes prior. Others just quietly reward whoever walked in first. Grisly Pear on MacDougal Street runs "show up first, go up first" depending on the host, which means the difference between arriving at 5:45 and 6:15 can be the difference between a 6:30 set and a 9pm set.',
          'If the listing says signup starts at 6:30, treat that as the latest comfortable arrival time, not the moment to walk through the door. Early arrival also gives you time to find the host, figure out where the list lives, and avoid rushing straight from the sidewalk onto the stage with your heart rate still at subway-transfer levels.',
        ],
      },
      {
        heading: 'Know what kind of signup it is before you leave the house',
        paragraphs: [
          'NYC signups fall into four buckets, and the split is nearly even. In-person lists are the classic: Grisly Pear and Producer\'s Club in Hell\'s Kitchen are both "in person only," no exceptions. Online presignups run through the producer\'s website or a booking form — Laughing Buddha posts its lists at laughingbuddhacomedy.com, Comedians on the Loose handles all seven of its weekly mics through its own site, and plenty of independent rooms use Slotted or Jotform links.',
          'Then there are the Instagram rooms and the personal ones. C Sweet Comedy in the East Village wants you to comment on their IG post before signing up in person. Harlem Nights is literally "text Rashad." One Gowanus mic posts its signup form on Instagram every Wednesday for a Friday show. None of this is hard, but assuming every room works the same way is how comics end up standing outside a bar at 7pm learning that the list closed online three days ago.',
          'Every mic page on this site lists the signup method when we\'ve verified it. Check it before you commit your night to a room.',
        ],
      },
      {
        heading: 'Expect five minutes, and treat it like four',
        paragraphs: [
          'Five minutes is the overwhelming standard — of the mics we track with a listed set length, well over half are exactly five, with a scattering of three- and four-minute rooms (Crayon Box in Williamsburg runs threes; QED in Astoria runs fours) and a few generous rooms that stretch to seven.',
          'The light at most mics is a suggestion the way a yellow traffic light is a suggestion: technically you can push through it, and everyone watching will judge you for it. Bring a set that finishes clean at four minutes so you have room to breathe, and have a two-minute version in your back pocket for rooms that are running long and cutting time.',
          'Pacing across the night is a different story. Some rooms move like an assembly line; others pause for drink orders, wait on comics who left to get food, or bunch fifteen people into the back half of the list. That is normal. Patience is part of the entry fee.',
        ],
      },
      {
        heading: 'Budget for the room',
        paragraphs: [
          'About one in four NYC mics is free, usually with the polite expectation that you buy something at the bar. Five dollars is the standard price everywhere else, and the outliers are mostly charming rather than expensive: Tiny Cupboard in Bushwick runs $2 mics, Comedy Shop in Greenwich Village charges $7.62 and hands you a free drink or fries, and a couple of East Village rooms have a one-drink minimum where the cheapest item is a $4 pineapple juice.',
          'Realistically, plan on ten to fifteen dollars for a night with one or two mics once you count the entry fee and a drink. If a room has an item minimum, honor it — that minimum is usually the only reason the venue tolerates a parade of comedians who tip in exposure.',
        ],
      },
      {
        heading: 'The etiquette baseline: be someone the host wants back',
        paragraphs: [
          'Stay in the room and watch other comics, especially the ones right before and after you. Hosts notice who supports the room and who materializes for their five minutes and evaporates. In a scene this small, that reputation follows you to rooms you haven\'t even been to yet.',
          'You don\'t need to fake laughter or network aggressively. Just don\'t treat the mic like a transaction. The comics you meet at your first mics are the same people who will be booking shows in two years.',
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
    readingTime: '6 min read',
    category: 'Formats',
    intro:
      'Not every mic is trying to do the same job. Some are built for reps, some for social momentum, and some are closer to showcases with a mic label attached. Knowing which format you\'re walking into changes how you should plan your night — and whether you should plan around that room at all.',
    sections: [
      {
        heading: 'Signup mics are the basic reps engine',
        paragraphs: [
          'A standard signup mic is the most straightforward format in comedy: you sign up, wait your turn, do your time, and move on. This is the bulk of the NYC circuit. The high-volume operations are built entirely on this model — Tiny Cupboard in Bushwick runs over twenty mics a week, Producer\'s Club in Hell\'s Kitchen runs around twenty, and Grisly Pear keeps ten going in the Village. Nobody is pretending these are shows. They are the gym.',
          'These rooms are best when you need stage reps, want to test new material in front of other comics, or are still learning how different neighborhoods feel. The tradeoff is that the "audience" is mostly comics waiting to go up, so a joke that dies at a 4pm signup mic might still work fine in front of civilians. Learn to read the difference between "this joke is bad" and "this room is forty comics deep and everyone is writing."',
        ],
      },
      {
        heading: 'Presignup rooms reward planning',
        paragraphs: [
          'A big slice of NYC mics — roughly a quarter of what we track — handle signup online before the night. Laughing Buddha runs its mics through its website. Comedians on the Loose fills all of its Black Cat LES mics through comediansontheloose.com. Independent rooms lean on Slotted links and Jotform pages, and some do it manually: one Gowanus mic posts a fresh signup form to Instagram every Wednesday for its Friday show.',
          'If you\'re organized, presignup rooms are easier to chain together, because by the afternoon you already know where you have slots and can route your night around them. The downside is that the rules drift — a form that used to hold your spot might now require day-of check-in, and lists for popular rooms fill fast. When a listing has both an online form and a check-in time, the check-in time is not optional.',
        ],
      },
      {
        heading: 'Bringer rooms are a different transaction entirely',
        paragraphs: [
          'A true bringer isn\'t really an open mic — it\'s a showcase where your stage time is purchased with audience members you bring. The pitch is a better room: a real crowd, a club stage, sometimes an industry-sounding name on the flyer. The cost is that you\'re supplying the customers, and your friends\' patience for $18-plus-two-drinks comedy outings is a finite, non-renewable resource.',
          'That doesn\'t automatically make bringers a scam. Early on, one or two can be useful — a real audience response tells you things a room full of comics never will. But if your development plan depends on repeatedly converting friendships into ticket sales, you will run out of both. Treat bringers as an occasional supplement, not the program.',
          'Don\'t confuse a bringer with an item minimum, either. "Free, but buy something at the bar" — which describes dozens of the mics we track — is just the room keeping its lights on. That\'s a fair trade, not a bringer.',
        ],
      },
      {
        heading: 'Match the format to the night you actually need',
        paragraphs: [
          'Testing brand-new material? A cheap high-volume signup mic is perfect — nobody remembers a bad set at a $2 mic. Trying to get comfortable with a nicer stage and a real mic stand? A presignup club room gives you structure. Need to feel an actual audience laugh at a bit before you trust it? That\'s the one thing a room full of comics can\'t give you, and where a carefully chosen bringer or a strong bar mic with civilians earns its keep.',
          'The mistake is treating every mic as interchangeable. They\'re tools, and they\'re shaped differently for a reason.',
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
    readingTime: '6 min read',
    category: 'Getting Started',
    intro:
      'The best beginner mic is rarely the one with the coolest flyer. It\'s the one where the signup is clear, the expectations are legible, and you can actually settle your nerves enough to perform. NYC has over 400 mics a week; the beginner move isn\'t finding the "best" one, it\'s finding two or three you can repeat until standing on a stage stops feeling like an emergency.',
    sections: [
      {
        heading: 'Look for rooms that spell out their rules',
        paragraphs: [
          'A room becomes dramatically easier when the listing already answers your questions. Compare "signup there" with Fear City\'s listing: arrive fifteen minutes before showtime, sign up in person, $5 cash, no DMs. That second room has thought about new people showing up. Ambiguity is a tax on beginners specifically — veterans already know the unwritten rules, and you don\'t yet.',
          'On this site, mics marked as verified have had their signup details confirmed recently. When you\'re new, favor those. Nothing curdles first-mic adrenaline faster than showing up to a room that moved, changed nights, or quietly died three months ago.',
        ],
      },
      {
        heading: 'Cheap, high-volume rooms are built for reps',
        paragraphs: [
          'Some venues run so many mics that a rough set simply doesn\'t matter. Tiny Cupboard in Bushwick runs more than twenty $2 mics a week — if you bomb at the 5:30, the 7:00 exists. Producer\'s Club in Hell\'s Kitchen runs about twenty $5 mics a week under one roof. Comedy Shop in the Village runs a dozen, and its afternoon mics come with a free drink or fries for the $7.62 entry.',
          'These rooms are the comedy equivalent of an empty gym at 2pm. Nobody is watching you critically, everyone is there to work, and volume beats intensity when you\'re learning. Your goal in month one is not a great set. It\'s twenty sets.',
        ],
      },
      {
        heading: 'Daytime mics are the best-kept non-secret in the city',
        paragraphs: [
          'Around 80 of the mics we track start before 5pm. Grisly Pear runs a Sunday 2pm mic. Comedy Shop runs afternoon mics most days. Seven Minutes in Heaven in Park Slope runs Wednesday mics at 3:30 and 5:00 with happy-hour drink prices. Daytime rooms are smaller, lower-stakes, and full of comics who take the work seriously enough to do it in the afternoon.',
          'For a first set, a Sunday afternoon mic is about as gentle as this city gets. The lists are shorter, you won\'t wait three hours, and you\'ll be home by dinner having done the scariest thing you\'ll do all week.',
        ],
      },
      {
        heading: 'Favor predictable stage time',
        paragraphs: [
          'Five minutes is the citywide standard, and it\'s the right length when you\'re starting — enough time to settle in, not so much that one rough set derails your whole week. A few rooms run three- or four-minute sets, which are honestly great for beginners too: it\'s hard to truly bomb for three minutes.',
          'What you want to avoid early is the loosely formatted room where sets balloon and the vibe depends entirely on who showed up. Those rooms can be a blast later. They\'re just hard to read when you don\'t have a baseline yet.',
        ],
      },
      {
        heading: 'Pick convenience over hype',
        paragraphs: [
          'A solid room near your train line that you\'ll actually revisit beats a famous room that turns one set into a three-hour ordeal. Manhattan and Brooklyn hold the vast majority of the city\'s mics — with the East Village, Bushwick, Williamsburg, and Greenwich Village as the densest clusters — so most people in either borough have multiple options within twenty minutes.',
          'Consistency compounds. The host starts recognizing you, the regulars learn your name, and the room stops being scary. The goal of your first month is not to find the perfect room. It\'s to build a repeatable habit.',
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
    readingTime: '6 min read',
    category: 'Rooms',
    intro:
      'Venue type changes the energy more than people expect. A comic doing the same material at a bar mic, a club mic, and a cafe mic can feel like three different performers. Of the mics we track, comedy clubs and bars host the large majority, with a small but valuable set of coffee shops, theaters, and oddball spaces filling out the rest.',
    sections: [
      {
        heading: 'Bar mics teach command, whether you asked to learn it or not',
        paragraphs: [
          'At a bar mic — Phoenix Bar in the East Village, Stumble Inn on the Upper East Side, Freddy\'s in Greenwood — you\'re sharing the room with people who came for a drink, not for you. There\'s a game on somewhere, the espresso machine of the beer world (the blender) is running, and your first ten seconds have to earn attention rather than assume it.',
          'That sounds miserable and is actually the point. Bar rooms tell you immediately whether your opener works, whether you can hold a room that owes you nothing, and whether your act survives contact with civilians. Many bar mics are free with a buy-something-at-the-bar expectation, so they\'re also the cheapest reps in the city. Some have found elegant compromises — a couple of East Village rooms run a one-drink minimum where the qualifying drink is a $4 pineapple juice.',
        ],
      },
      {
        heading: 'Coffee shop rooms are rare and worth knowing about',
        paragraphs: [
          'True cafe mics are scarce — only about a dozen citywide in our data. Black Cat LES hosts the Comedians on the Loose mics several nights a week. QED in Astoria runs a Wednesday evening mic. Caffeine Underground in Bushwick and Cool Beans in Astoria round out the short list.',
          'These rooms are quieter and more listening-oriented, which makes them the best places in the city to hear how your actual writing lands. There\'s no bar noise to blame and no drunk table to play off. The flip side: low-energy delivery flattens fast in a gentle room, and a crowd that listens politely to everything can lull you into thinking a mid joke is finished. Use cafes to sharpen wording, then pressure-test the bit somewhere louder.',
        ],
      },
      {
        heading: 'Club and black-box mics rehearse the real thing',
        paragraphs: [
          'Club rooms — Grisly Pear, Eastville Comedy Club, Bushwick Comedy Club, St. Marks Comedy Club, and the dozens like them — give you the physical grammar of an actual show: a real stage, a real mic stand, stage lights, a host doing tight transitions. If your goal is getting comfortable with the mechanics of performing, this is where you practice pulling the mic out of the stand without looking like you\'re defusing it.',
          'The structure comes with economics. Club mics usually charge — $5 is standard, sometimes with an item minimum on top — and signup expectations are firmer. Some are in-person only; others, like the Laughing Buddha rooms, run on advance online lists. Budget accordingly and read the listing before you go.',
        ],
      },
      {
        heading: 'Rotate rooms on purpose',
        paragraphs: [
          'Each room type measures something different: bars measure command, cafes measure writing, clubs measure polish. A comic who only does bar mics develops volume and crowd control but sometimes stops trusting quiet material. A comic who only does listening rooms writes beautifully and then gets steamrolled the first time a bachelorette party sits front row.',
          'The comics who develop fastest treat venue type as part of the workout plan. Same jokes, different rooms, and pay attention to what changes.',
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
    readingTime: '6 min read',
    category: 'Community',
    intro:
      'Most open mic etiquette is ordinary social awareness. The issue is that comedy scenes are small, people remember patterns, and careless behavior travels faster than good intentions. The NYC scene runs hundreds of mics a week, but the pool of hosts and regulars is small enough that your reputation arrives at rooms before you do.',
    sections: [
      {
        heading: 'Do support the room you are using',
        paragraphs: [
          'Every mic exists because someone is paying for it in time, rent, labor, or credibility with a venue owner. When a bar hosts a free mic, the deal keeping it alive is usually "comics buy things." That\'s why so many listings say some version of "free — please buy something at the bar," and why a few rooms formalize it with a one-item minimum. The rooms that make it painless — the $4 pineapple juice minimum is a real and beloved example — are meeting broke comics halfway. Meet them back.',
          'If a mic charges $5, that five dollars is often the host breaking even on the room rental. You don\'t need to perform gratitude. You do need to act like the room is not disposable, because the venues cancel mics that cost them money, and then everyone has one fewer place to work.',
        ],
      },
      {
        heading: 'Do not make the signup harder for the host',
        paragraphs: [
          'Hosts are juggling venue pressure, room timing, and a list of comics who all quietly believe their situation is special. Late arrivals who want to be squeezed in, vague DMs to rooms that clearly say "in person only," and last-second bargaining over lineup position all add friction to a job that is usually unpaid.',
          'The rules are rarely complicated. Fear City\'s listing says sign up in person, no DMs — so don\'t DM them. If a room signs up through a form, use the form. Being easy to deal with is a genuine competitive advantage in comedy, partly because the bar is so low.',
        ],
      },
      {
        heading: 'Handle the leave-after-your-set problem honestly',
        paragraphs: [
          'The most common etiquette failure at any mic: a comic does their five minutes and immediately vanishes, leaving the next person to perform for a thinner room. Multiply that by twenty comics and the last third of every list plays to empty chairs. Everyone hates this, and almost everyone has done it, because stacking multiple mics in a night is how NYC comics get their reps.',
          'The workable compromise: if you have to leave, stay for at least a few comics after your set, tell the host you\'re running to another mic, and don\'t walk out mid-set — wait for the light or the transition. Hosts genuinely don\'t mind mic-stackers. They mind the comic who treats the room as a vending machine.',
        ],
      },
      {
        heading: 'Treat other comics like peers, not obstacles',
        paragraphs: [
          'Watch sets. Learn names. Talk to people without immediately angling for a favor. The easiest way to become invisible in comedy is to interact only when you want something, and the comics grinding through the same Tuesday mics as you are the same people who will be producing shows, trading spots, and recommending names in a few years.',
          'Good scene habits compound quietly over time, and so do bad ones. Nobody keeps a formal ledger. Everybody keeps an informal one.',
        ],
      },
    ],
  },
];

export const guideArticleMap = Object.fromEntries(
  guideArticles.map((article) => [article.slug, article])
);
