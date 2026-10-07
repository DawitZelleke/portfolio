import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { Reveal } from '@/components/motion';
import { Section } from '@/components/layout/Section';
import { BountyPoster } from './BountyPoster';
import { chart, islands, type Island, type IslandId } from '@/content/offTheClock';

/* ------------------------------------------------------------------ */
/* Chart geometry — all in the 760×400 viewBox                         */
/* ------------------------------------------------------------------ */

const HOME = { x: 80, y: 300 };
const COMPASS = { x: 668, y: 316, r: 44 };

/** Home port → faith → gym → grand line. */
/** Runs below each island so the coastline is hugged, never crossed. */
const ROUTE =
  'M 80 300 C 126 288 176 232 232 176 C 300 112 386 240 452 296 C 512 338 578 250 640 172';

/** The ship moors in open water just west of whichever island is open. */
const MOORING = { dx: -52, dy: 14 };

const LANDMASS =
  'M -34 8 C -30 -6 -18 -16 -4 -14 C 8 -20 24 -14 28 -2 C 36 2 36 14 26 16 C 10 22 -14 22 -28 18 C -36 16 -38 12 -34 8 Z';

function Glyph({ kind }: { kind: Island['glyph'] }) {
  const stroke = 'var(--color-accent-deep)';
  if (kind === 'lighthouse') {
    return (
      <g stroke={stroke} strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M -5 0 L -3.5 -13 L 3.5 -13 L 5 0 Z" />
        <path d="M -5.5 -6 L 5.5 -6" />
        <path d="M -4.5 -15.5 L 4.5 -15.5" />
        <circle cx="0" cy="-18.5" r="2.2" fill={stroke} stroke="none" />
        <path d="M -9 -21 L -5 -19.5 M 9 -21 L 5 -19.5" opacity="0.7" />
      </g>
    );
  }
  if (kind === 'barbell') {
    return (
      <g stroke={stroke} strokeWidth="1.7" strokeLinecap="round" fill="none">
        <path d="M -12 -8 L 12 -8" />
        <path d="M -8.5 -13 L -8.5 -3 M 8.5 -13 L 8.5 -3" />
        <path d="M -12.5 -11 L -12.5 -5 M 12.5 -11 L 12.5 -5" />
      </g>
    );
  }
  return (
    <g stroke={stroke} strokeWidth="1.6" strokeLinecap="round" fill="none">
      <path d="M -9 -3 L 9 -3 L 6 2 L -6 2 Z" />
      <path d="M 0 -4 L 0 -18" />
      <path d="M 1.5 -17 C 8 -13 9 -9 8.5 -5 L 1.5 -5 Z" fill={stroke} stroke="none" opacity="0.85" />
    </g>
  );
}

/* ------------------------------------------------------------------ */

export function OffTheClockSection() {
  const reduce = useReducedMotion();
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<IslandId>(islands[0]!.id);
  const [hovered, setHovered] = useState<IslandId | null>(null);
  const [posterOpen, setPosterOpen] = useState(false);

  const selected = islands.find((i) => i.id === selectedId) ?? islands[0]!;

  /* The route inks itself in as the chart scrolls into view. */
  const { scrollYProgress } = useScroll({
    target: chartRef,
    offset: ['start 0.95', 'center 0.6'],
  });
  const routeLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const ship = { x: selected.x + MOORING.dx, y: selected.y + MOORING.dy };

  return (
    <Section id="off-duty" entry="06 · off the clock" title="Off the clock">
      <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-10">
        {/* ------------------------------ the chart ------------------------------ */}
        <Reveal>
          <div
            ref={chartRef}
            className="overflow-hidden rounded-card border border-line bg-surface shadow-card"
          >
            <svg
              viewBox="0 0 760 400"
              className="block h-auto w-full"
              role="img"
              aria-label="A sea chart of three islands: faith, the gym, and One Piece. Use the buttons below to read each one."
            >
              <defs>
                <pattern id="sea-dots" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="0.9" fill="var(--color-line-strong)" opacity="0.5" />
                </pattern>
                <radialGradient id="sea-vignette" cx="46%" cy="42%" r="70%">
                  <stop offset="55%" stopColor="var(--color-accent-tint)" stopOpacity="0" />
                  <stop offset="100%" stopColor="var(--color-accent-deep)" stopOpacity="0.09" />
                </radialGradient>
              </defs>

              {/* sea */}
              <rect width="760" height="400" fill="var(--color-surface-2)" />
              <rect width="760" height="400" fill="url(#sea-dots)" />
              <rect width="760" height="400" fill="url(#sea-vignette)" />

              {/* graticule */}
              <g stroke="var(--color-line-strong)" strokeWidth="0.8" opacity="0.5">
                <path d="M0 100 H760 M0 200 H760 M0 300 H760" strokeDasharray="2 10" />
                <path d="M190 0 V400 M380 0 V400 M570 0 V400" strokeDasharray="2 10" />
              </g>

              {/* swell — slow, transform-only, off under reduced motion */}
              {!reduce &&
                [
                  { d: 'M60 356 q 18 -7 36 0 t 36 0', delay: 0 },
                  { d: 'M300 372 q 18 -7 36 0 t 36 0', delay: 0.9 },
                  { d: 'M560 360 q 18 -7 36 0 t 36 0', delay: 1.7 },
                ].map((w) => (
                  <motion.path
                    key={w.d}
                    d={w.d}
                    fill="none"
                    stroke="var(--color-line-strong)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    opacity="0.65"
                    animate={{ y: [0, -3.5, 0], opacity: [0.4, 0.75, 0.4] }}
                    transition={{
                      duration: 5.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: w.delay,
                    }}
                  />
                ))}

              {/* route: ghost underneath, inked line drawn on scroll */}
              <path
                d={ROUTE}
                fill="none"
                stroke="var(--color-line-strong)"
                strokeWidth="1.6"
                strokeDasharray="1 9"
                strokeLinecap="round"
                opacity="0.7"
              />
              <motion.path
                d={ROUTE}
                fill="none"
                stroke="var(--color-accent-bright)"
                strokeWidth="2.2"
                strokeDasharray="7 7"
                strokeLinecap="round"
                style={reduce ? { pathLength: 1 } : { pathLength: routeLength }}
              />

              {/* home port */}
              <g>
                <rect
                  x={HOME.x - 5}
                  y={HOME.y - 5}
                  width="10"
                  height="10"
                  fill="var(--color-ink)"
                  transform={`rotate(45 ${HOME.x} ${HOME.y})`}
                />
                <text
                  x={HOME.x - 2}
                  y={HOME.y + 26}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize="10.5"
                  letterSpacing="1.6"
                  fill="var(--color-ink)"
                >
                  {chart.homePort}
                </text>
                <text
                  x={HOME.x - 2}
                  y={HOME.y + 40}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize="8.5"
                  letterSpacing="1.2"
                  fill="var(--color-ink-faint)"
                >
                  {chart.homePortSub}
                </text>
              </g>

              {/* islands */}
              {islands.map((island) => {
                const isSelected = island.id === selectedId;
                const isHovered = hovered === island.id;
                return (
                  <motion.g
                    key={island.id}
                    transform={`translate(${island.x},${island.y})`}
                    onClick={() => setSelectedId(island.id)}
                    onPointerEnter={() => setHovered(island.id)}
                    onPointerLeave={() => setHovered(null)}
                    style={{ cursor: 'pointer' }}
                    animate={{ y: reduce ? 0 : isHovered || isSelected ? -4 : 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    {/* selection: survey brackets, in the chart's own annotation voice */}
                    {isSelected && (
                      <motion.path
                        d="M -46 -20 v -12 h 12 M 46 -20 v -12 h -12 M -46 18 v 12 h 12 M 46 18 v 12 h -12"
                        fill="none"
                        stroke="var(--color-accent-bright)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        initial={{ opacity: 0 }}
                        animate={reduce ? { opacity: 0.9 } : { opacity: [0.9, 0.35, 0.9] }}
                        transition={
                          reduce ? { duration: 0.2 } : { duration: 3.2, repeat: Infinity }
                        }
                      />
                    )}

                    <path
                      d={LANDMASS}
                      fill={isSelected ? 'var(--color-accent-tint)' : 'var(--color-surface)'}
                      stroke={
                        isSelected ? 'var(--color-accent-bright)' : 'var(--color-line-strong)'
                      }
                      strokeWidth="1.5"
                    />
                    <Glyph kind={island.glyph} />
                    {/* Halo drawn as its own element rather than with paint-order,
                        which not every engine honours — a swallowed label is
                        worse than a duplicated node. */}
                    <text
                      x="0"
                      y="-40"
                      textAnchor="middle"
                      className="font-mono"
                      fontSize="9.5"
                      letterSpacing="1.5"
                      fill="none"
                      stroke="var(--color-surface-2)"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {island.chartName}
                    </text>
                    <text
                      x="0"
                      y="-40"
                      textAnchor="middle"
                      className="font-mono"
                      fontSize="9.5"
                      letterSpacing="1.5"
                      fill={isSelected ? 'var(--color-accent-deep)' : 'var(--color-ink-soft)'}
                    >
                      {island.chartName}
                    </text>
                  </motion.g>
                );
              })}

              {/* the ship, sailing to whichever island is open */}
              <motion.g
                animate={{ x: ship.x, y: ship.y }}
                initial={false}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 70, damping: 16, mass: 1.1 }
                }
              >
                <motion.g
                  animate={reduce ? {} : { rotate: [-5, 5, -5] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                >
                  <path
                    d="M -8 3 L 8 3 L 5 8 L -5 8 Z"
                    fill="var(--color-ink)"
                  />
                  <path d="M 0 2 L 0 -13" stroke="var(--color-ink)" strokeWidth="1.5" />
                  <path d="M 1 -12 C 7 -8.5 8 -5 7.5 -1 L 1 -1 Z" fill="var(--color-accent-deep)" />
                </motion.g>
              </motion.g>

              {/* compass rose — the hub is the easter egg */}
              <g transform={`translate(${COMPASS.x},${COMPASS.y})`}>
                <circle
                  r={COMPASS.r}
                  fill="var(--color-surface)"
                  fillOpacity="0.92"
                  stroke="var(--color-line-strong)"
                  strokeWidth="1.2"
                />
                <circle r={COMPASS.r - 8} fill="none" stroke="var(--color-line)" strokeWidth="0.9" />
                {Array.from({ length: 16 }).map((_, i) => {
                  const long = i % 4 === 0;
                  return (
                    <line
                      key={i}
                      x1="0"
                      y1={-(COMPASS.r - 2)}
                      x2="0"
                      y2={-(COMPASS.r - (long ? 11 : 6))}
                      stroke="var(--color-ink-faint)"
                      strokeWidth={long ? 1.3 : 0.7}
                      transform={`rotate(${i * 22.5})`}
                    />
                  );
                })}
                <text
                  x="0"
                  y={-(COMPASS.r + 6)}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize="9"
                  letterSpacing="1.4"
                  fill="var(--color-ink-soft)"
                >
                  N
                </text>

                <motion.g
                  animate={{ rotate: selected.bearing }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 90, damping: 11, mass: 0.7 }
                  }
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                >
                  <path d="M 0 -30 L 6.5 0 L 0 8 L -6.5 0 Z" fill="var(--color-accent-bright)" />
                  <path d="M 0 30 L 6.5 0 L 0 -8 L -6.5 0 Z" fill="var(--color-ink-faint)" />
                </motion.g>

                <circle
                  r="7"
                  fill="var(--color-ink)"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setPosterOpen(true)}
                />
              </g>

              {/* ledger annotations */}
              <text
                x="24"
                y="34"
                className="font-mono"
                fontSize="9.5"
                letterSpacing="1.6"
                fill="var(--color-ink-faint)"
              >
                45.42°N 75.70°W · {chart.compassLabel}
              </text>
              <g transform="translate(24, 372)">
                <path
                  d="M0 0 H64"
                  stroke="var(--color-ink-faint)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path d="M0 -4 V4 M64 -4 V4" stroke="var(--color-ink-faint)" strokeWidth="1.2" />
                <text
                  x="70"
                  y="3.5"
                  className="font-mono"
                  fontSize="8.5"
                  letterSpacing="1.2"
                  fill="var(--color-ink-faint)"
                >
                  one long haul
                </text>
              </g>
            </svg>
          </div>

          {/* real controls — the SVG is the picture, these are the interface */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="ledger mr-1">{chart.hint}</span>
            {islands.map((island) => {
              const isSelected = island.id === selectedId;
              return (
                <button
                  key={island.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(island.id)}
                  onPointerEnter={() => setHovered(island.id)}
                  onPointerLeave={() => setHovered(null)}
                  className={`min-h-11 cursor-pointer rounded-button border px-4 py-2 text-[0.9rem] font-semibold transition-colors duration-fast ${
                    isSelected
                      ? 'border-accent-bright bg-accent-tint text-accent-deep'
                      : 'border-line-strong text-ink-soft hover:border-accent hover:text-accent'
                  }`}
                >
                  {island.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setPosterOpen(true)}
              className="sr-only focus:not-sr-only focus:rounded-button focus:border focus:border-line-strong focus:px-4 focus:py-2 focus:text-[0.9rem] focus:text-ink-soft"
            >
              Reveal the wanted poster
            </button>
          </div>
        </Reveal>

        {/* ------------------------------ the log ------------------------------ */}
        <Reveal delay={0.08}>
          <div className="rounded-card border border-line bg-surface p-6 shadow-card sm:p-7">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selected.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                transition={{ duration: reduce ? 0.15 : 0.24 }}
              >
                <p className="ledger ledger-rule mb-4">{selected.entry}</p>
                <h3 className="font-display text-title font-semibold tracking-tight text-ink">
                  {selected.heading}
                </h3>
                <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">
                  {selected.body}
                </p>
                <p className="ledger mt-6 border-t border-line pt-4">{selected.log}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>

      <BountyPoster open={posterOpen} onClose={() => setPosterOpen(false)} />
    </Section>
  );
}
