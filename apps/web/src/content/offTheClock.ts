/**
 * "Off the clock" — the three things that sit outside the editor.
 *
 * Everything the sea chart draws comes from this file: coordinates are in
 * the chart's own viewBox space (0 0 760 400), `bearing` is the compass
 * needle rotation in degrees. Edit the copy freely — especially `faith`,
 * which should sound like you and not like a portfolio.
 */

export type IslandId = 'faith' | 'gym' | 'grand-line';

export type Island = {
  id: IslandId;
  /** Short label for the tab buttons */
  label: string;
  /** Name inked on the chart */
  chartName: string;
  glyph: 'lighthouse' | 'barbell' | 'ship';
  bearing: number;
  x: number;
  y: number;
  entry: string;
  heading: string;
  body: string;
  /** Mono footnote, in the site's "ledger" voice */
  log: string;
};

export const islands: Island[] = [
  {
    id: 'faith',
    label: 'Faith',
    chartName: 'THE FIXED POINT',
    glyph: 'lighthouse',
    bearing: -38,
    x: 232,
    y: 132,
    entry: 'first bearing',
    heading: 'The one bearing that does not move',
    body:
      'My faith is the thing everything else here gets navigated against — the training, the code, the ambition. It is also, quietly, why I build the way I do: I would rather ship software people can actually trust than software that merely runs. Careful work is a form of respect for whoever is on the other side of it.',
    log: 'the compass, not the wind',
  },
  {
    id: 'gym',
    label: 'The gym',
    chartName: 'PROGRESSIVE OVERLOAD',
    glyph: 'barbell',
    bearing: 74,
    x: 452,
    y: 254,
    entry: 'second bearing',
    heading: 'You cannot argue with the bar',
    body:
      'The gym is the most honest teacher I have had. Add a little weight, show up again, repeat for years — there is no version where motivation substitutes for the reps. It is the same shape as shipping software: small boring increments, logged and repeatable, beat bursts of enthusiasm every single time.',
    log: 'PRs, the other kind',
  },
  {
    id: 'grand-line',
    label: 'One Piece',
    chartName: 'THE LONG VOYAGE',
    glyph: 'ship',
    bearing: 152,
    x: 640,
    y: 128,
    entry: 'third bearing',
    heading: 'A crew that refuses to leave anyone behind',
    body:
      'I am deep in One Piece — twenty-five years of world-building where the payoff is always further out than you think, and the whole engine of the story is a crew who will not abandon each other. I read it the way I read good systems: the patient design wins, and your crew sets your ceiling. Ask me about it and lose an afternoon.',
    log: 'still nobody has found the treasure',
  },
];

export const chart = {
  homePort: 'OTTAWA',
  homePortSub: 'home port',
  hint: 'pick an island',
  /** Shown before anything is selected on desktop hover-away */
  compassLabel: 'log pose',
} as const;

/**
 * The easter egg. Drop a photo in apps/web/public and set `portrait` to
 * its path (e.g. '/portrait.jpg') — leave it null and the poster keeps
 * the "no photo on record" frame, which is funnier anyway.
 */
export const poster = {
  portrait: null as string | null,
  issuer: 'ottawa branch · world development office',
  wantedFor: 'shipping secure, backend-heavy web applications without being asked twice',
  reward: 'one (1) co-op offer',
  alias: 'DAVEVSGOLIATH',
  lastSeen: 'at a keyboard, 02:40',
  stamp: 'on the record',
} as const;
