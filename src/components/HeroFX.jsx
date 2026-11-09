import { motion, useMotionTemplate, useTransform } from 'framer-motion'

const pad = (n) => String(Math.max(0, Math.round(n))).padStart(4, '0')

// Faint blue grid that lights up around the cursor, over the static blueprint grid.
export function GridGlow({ pointer }) {
  const { sx, sy, inside } = pointer
  const mask = useMotionTemplate`radial-gradient(240px circle at ${sx}px ${sy}px, #000 0%, rgba(0,0,0,0.5) 45%, transparent 100%)`
  const halo = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, rgba(145,180,255,0.08), transparent 70%)`
  return (
    <>
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: halo, opacity: inside }} />
      <motion.div
        aria-hidden="true"
        className="grid-lines-accent pointer-events-none absolute inset-0"
        style={{ maskImage: mask, WebkitMaskImage: mask, opacity: inside }}
      />
    </>
  )
}

// CAD-style crosshair with a live coordinate readout.
export function Crosshair({ pointer }) {
  const { sx, sy, inside } = pointer
  const label = useTransform(() => `X ${pad(sx.get())}  Y ${pad(sy.get())}`)
  const tagX = useTransform(sx, (v) => v + 14)
  const tagY = useTransform(sy, (v) => v + 14)
  const opacity = useTransform(inside, [0, 1], [0, 1])
  return (
    <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={{ opacity }}>
      <motion.div className="absolute top-0 bottom-0 left-0 w-px bg-blue/[0.2]" style={{ x: sx }} />
      <motion.div className="absolute top-0 right-0 left-0 h-px bg-blue/[0.2]" style={{ y: sy }} />
      <motion.div
        className="absolute top-0 left-0 size-2.5 -translate-x-1/2 -translate-y-1/2 border border-blue/60"
        style={{ x: sx, y: sy }}
      />
      <motion.span
        className="absolute top-0 left-0 font-mono text-[10px] tracking-[0.12em] whitespace-pre text-blue/70"
        style={{ x: tagX, y: tagY }}
      >
        {label}
      </motion.span>
      {/* Edge ticks that slide along the frame, like a ruler cursor */}
      <motion.div className="absolute top-0 left-0 h-3 w-px bg-blue/60" style={{ x: sx }} />
      <motion.div className="absolute top-0 left-0 h-px w-3 bg-blue/60" style={{ y: sy }} />
    </motion.div>
  )
}

// Registration / crop marks in the corners of the hero frame.
export function CornerMarks() {
  const mark = 'absolute size-5 border-heading/25'
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-4 md:inset-6">
      <span className={`${mark} top-0 left-0 border-t border-l`} />
      <span className={`${mark} top-0 right-0 border-t border-r`} />
      <span className={`${mark} bottom-0 left-0 border-b border-l`} />
      <span className={`${mark} right-0 bottom-0 border-r border-b`} />
      <span className="absolute bottom-0 left-8 hidden font-mono text-[10px] tracking-[0.2em] text-body/50 md:block">
        SHEET 01 / 04
      </span>
      <span className="absolute right-8 bottom-0 hidden font-mono text-[10px] tracking-[0.2em] text-body/50 md:block">
        SCALE 1 : 1
      </span>
    </div>
  )
}
