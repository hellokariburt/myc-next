import { MicDetail } from '@/lib/types/mic';
import changeTime from '@/lib/utils/changeTime';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import { isFreeCost } from '@/lib/utils/isFree';

interface CuratedMicCopy {
  venueContext?: string[];
  whatToExpect?: string[];
}

export interface MicEditorialContent {
  venueContext: string[];
  whatToExpect: string[];
  beforeYouGo: string[];
}

const curatedByVenue: Record<string, CuratedMicCopy> = {
  'comedy shop': {
    venueContext: [
      'Comedy Shop sits in the Greenwich Village mic ecosystem where comics often stack multiple sets in one night. That makes it a practical stop for people trying to keep momentum moving rather than building an entire night around one room.',
      'Because the venue is already known to working comics, the pace tends to feel more plugged into the regular NYC mic circuit than a one-off bar room.',
    ],
    whatToExpect: [
      'Expect a room that rewards being organized before you arrive. If the signup is online, handle it early and treat the confirmation process seriously so you are not improvising at the door.',
    ],
  },
  'grisly pear': {
    venueContext: [
      'Grisly Pear is one of those names newer comics hear quickly because MacDougal Street pulls constant foot traffic and keeps comedy in the mix all week. That gives the room a distinctly Village feel rather than an isolated neighborhood mic feel.',
      'For comics who want reps in a comedy-club-adjacent environment, it is the kind of venue that helps you get comfortable with busier, more scene-aware rooms.',
    ],
    whatToExpect: [
      'Plan for a fairly brisk room culture. Arriving early, understanding the host instructions, and being ready when your name is called matter more here than overexplaining your situation after the list starts moving.',
    ],
  },
  'greenwich village comedy club': {
    venueContext: [
      'Greenwich Village Comedy Club is a recognizable stop for comics trying to learn the Village corridor. The room benefits from being in an area where multiple mics, clubs, and comedy-adjacent hangouts sit close together.',
      'That surrounding context makes this a useful mic if you are building a full night in lower Manhattan rather than only chasing one set.',
    ],
  },
  'fear city comedy club': {
    venueContext: [
      'Fear City sits on the Lower East Side side of the mic landscape, which often feels a little less tourist-heavy and a little more neighborhood-driven than the Village corridor. That changes the rhythm of the room even before the mic starts.',
      'If you are comparing Manhattan mics, this is the kind of room where location and surrounding scene matter almost as much as the set length.',
    ],
  },
  'eastville comedy club': {
    venueContext: [
      'Eastville’s Brooklyn room is useful for comics who want a more structured setup without crossing back into Manhattan. It tends to attract people who are balancing practical stage time with a room that still feels like an actual show environment.',
      'That makes it a solid bridge between purely casual bar mics and more formal club rooms.',
    ],
  },
  'the tiny cupboard': {
    venueContext: [
      'The Tiny Cupboard has become one of the anchors of the Bushwick and Bed-Stuy comedy orbit, so mics there often feel tied into a larger independent comedy scene rather than existing as a single isolated event.',
      'That usually means you will run into a mix of newer comics, regular room supporters, and people bouncing between several Brooklyn spots.',
    ],
  },
  'qed astoria': {
    venueContext: [
      'QED is one of the clearer destination venues outside the Manhattan and central Brooklyn loops. Astoria comics often treat it as a real local hub rather than a random one-night room.',
      'That gives the mic a little more community continuity than venues where the comedy identity is secondary to the bar itself.',
    ],
  },
  "producer's club": {
    venueContext: [
      "Producer's Club sits in a theater-heavy part of Midtown, so the room often feels more black-box and rehearsal-oriented than a typical bar mic. That can be useful if you want stage reps in a setting with a little more separation from bar noise.",
      'It is a practical option for comics who are already hopping around Midtown and want a venue that feels more like a performance space than a casual back room.',
    ],
  },
  pinebox: {
    venueContext: [
      'Pinebox rooms tend to feel embedded in the East Williamsburg and Bushwick social circuit, where bar energy and comedy energy share the room. That makes crowd texture less predictable, but it can produce useful reps for comics learning to command attention.',
    ],
  },
  sleepwalk: {
    venueContext: [
      'Sleepwalk is the kind of Williamsburg venue where room tone matters almost as much as the formal mic rules. The setting can reward comics who settle in quickly and read the energy rather than forcing a rigid show-club rhythm onto the room.',
    ],
  },
};

const curatedByName: Record<string, CuratedMicCopy> = {
  'all american': {
    whatToExpect: [
      'This room reads like a bar mic first, which usually means the social atmosphere around the set is part of the experience. If you are comfortable winning over a room that may not be perfectly still, that can be productive stage time.',
    ],
  },
  'crayon box': {
    whatToExpect: [
      'The room is better approached with flexibility than perfectionism. Be ready for a short set, keep your opening tight, and expect the energy to depend heavily on who is already in the room when the list starts.',
    ],
  },
};

function normalize(value: string | null | undefined): string {
  return (value ?? '').trim().toLowerCase();
}

function buildVenueContext(mic: MicDetail): string[] {
  const venue = mic.mic_address?.venue ?? 'This mic';
  const neighborhood = mic.mic_address?.neighborhood;
  const borough = mic.borough ? capitalizeDay(mic.borough) : 'NYC';
  const venueType = mic.venue_type?.toLowerCase();

  const locationSentence = neighborhood
    ? `${venue} runs in ${neighborhood}, ${borough}, which matters because neighborhood context changes who actually makes it into the room. A Village mic, a Lower East Side mic, and an Astoria mic can all feel very different even before the first comic goes up.`
    : `${venue} is part of the ${borough} mic circuit, and that local context often matters as much as the raw signup details. Where a room sits in the city changes how comics stack it with other sets and what kind of crowd energy shows up.`;

  const typeSentence = venueType
    ? `As a ${venueType}, the venue shapes the set in predictable ways: room noise, host pacing, and audience focus all depend on whether this is more club-like, more bar-like, or somewhere in between.`
    : 'The venue setup itself is worth paying attention to because open mics are rarely interchangeable once you are standing in the room.';

  return [locationSentence, typeSentence];
}

function buildWhatToExpect(mic: MicDetail): string[] {
  const parts: string[] = [];
  const stageTime = mic.stage_time?.trim();
  const cost = mic.mic_cost?.cost_amount?.trim();
  const signup = mic.signup_instructions?.instructions?.trim();
  const schedule = mic.mic_occurrence?.schedule?.trim();

  const timeSentence = stageTime
    ? `Plan your set around roughly ${stageTime} on stage. In practice, that means showing up with a tight opener, one clear middle idea, and an ending that can land even if the room is moving quickly.`
    : 'Plan for a short set unless the host says otherwise. Most NYC mic rooms reward material that gets to the point fast.';
  parts.push(timeSentence);

  if (signup) {
    parts.push(
      `Signup matters here: ${signup}. Read that literally before you head out, because a lot of avoidable frustration comes from comics assuming every mic uses the same process.`
    );
  }

  if (cost) {
    parts.push(
      isFreeCost(cost)
        ? 'Cost is relatively low-friction here, but free rooms still usually work best when comics treat the venue respectfully and support the room if they can.'
        : `Budget for ${cost}. In NYC that kind of cost or item minimum is normal, so it is better to treat it as part of planning the night than as a surprise at the venue.`
    );
  }

  if (schedule) {
    parts.push(
      `The listing is marked ${schedule.toLowerCase()}, which is useful for building repeat habits. Rooms that run on a dependable cadence are easier to revisit and compare over time.`
    );
  }

  return parts;
}

function buildBeforeYouGo(mic: MicDetail): string[] {
  const day = capitalizeDay(mic.day ?? '');
  const startTime = mic.start_time ? changeTime(mic.start_time) : null;
  const beforeYouGo = [
    startTime
      ? `Aim to arrive before ${day} at ${startTime}, especially if the signup is handled in person or the host builds the list manually.`
      : `Aim to arrive early on ${day}, especially if the signup is handled in person or the host builds the list manually.`,
  ];

  if (mic.other_rules) {
    beforeYouGo.push(`House note: ${mic.other_rules}.`);
  }

  if (mic.notes) {
    beforeYouGo.push(`Additional note: ${mic.notes}.`);
  }

  if (mic.instagram) {
    beforeYouGo.push(
      'If plans look fuzzy day-of, check the room or host Instagram before you travel. NYC mics change time, cost, and signup format more often than comics would like.'
    );
  }

  return beforeYouGo;
}

export function getMicEditorialContent(mic: MicDetail): MicEditorialContent {
  const venueKey = normalize(mic.mic_address?.venue);
  const nameKey = normalize(mic.name);
  const curated = {
    ...curatedByVenue[venueKey],
    ...curatedByName[nameKey],
  };

  return {
    venueContext: curated.venueContext ?? buildVenueContext(mic),
    whatToExpect: [...(curated.whatToExpect ?? []), ...buildWhatToExpect(mic)],
    beforeYouGo: buildBeforeYouGo(mic),
  };
}
