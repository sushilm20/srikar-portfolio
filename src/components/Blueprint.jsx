import { motion, useTransform } from 'framer-motion'
import { ease } from '@/lib/motion'

// Engineering drawing of a pulley (one of Srikar's CAD parts), front view.
// Strokes draw in on load; `progress` (0→1 hero scroll) rotates the wheel slowly.
const draw = (delay = 0, duration = 1.6) => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay, duration, ease }, opacity: { delay, duration: 0.2 } },
  },
})

const fade = (delay = 0) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { delay, duration: 0.8, ease } },
})

export function Blueprint({ progress, reduced }) {
  const rotate = useTransform(progress, [0, 1], [0, reduced ? 0 : 90])
  const spokes = [0, 60, 120, 180, 240, 300]

  return (
    <motion.svg
      viewBox="0 0 520 520"
      className="h-full w-full overflow-visible"
      initial="hidden"
      animate="show"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
    >
      {/* Frame + title block */}
      <motion.rect x="10" y="10" width="500" height="500" rx="4" strokeOpacity="0.18" variants={draw(0, 1.8)} />
      <motion.path d="M10 462 H510 M300 462 V510" strokeOpacity="0.18" variants={draw(0.4, 1.2)} />
      <motion.g variants={fade(1.4)} stroke="none" fill="currentColor" className="font-mono" fontSize="10" letterSpacing="1.5">
        <text x="24" y="490" fillOpacity="0.55">PULLEY · FRONT VIEW</text>
        <text x="316" y="490" fillOpacity="0.55">FIG. 01 · SM / NJIT</text>
        <text x="24" y="34" fillOpacity="0.4">OBSERVE → EXPLORE → BUILD</text>
      </motion.g>

      {/* Centre lines (dash-dot) */}
      <motion.path
        d="M260 40 V440 M40 240 H480"
        strokeOpacity="0.35"
        strokeDasharray="14 5 2 5"
        variants={draw(0.2, 1.4)}
      />

      {/* Rotating wheel */}
      <motion.g style={{ rotate }}>
        <motion.circle cx="260" cy="240" r="170" strokeWidth="1.6" className="text-blue" stroke="currentColor" variants={draw(0.3)} />
        <motion.circle cx="260" cy="240" r="152" strokeOpacity="0.5" variants={draw(0.45)} />
        <motion.circle cx="260" cy="240" r="128" strokeOpacity="0.7" variants={draw(0.6)} />
        <motion.circle cx="260" cy="240" r="52" strokeWidth="1.4" variants={draw(0.75)} />
        {/* Bore with keyway */}
        <motion.path
          d="M260 214 A26 26 0 1 0 266 214.7 V206 H254 V214.7 A26 26 0 0 0 260 214"
          className="text-blue"
          stroke="currentColor"
          strokeWidth="1.4"
          variants={draw(0.9, 1.2)}
        />
        {/* Spokes */}
        {spokes.map((a, i) => (
          <motion.path
            key={`e-${a}`}
            d="M255 188 V112 M265 188 V112"
            transform={`rotate(${a} 260 240)`}
            strokeOpacity="0.6"
            variants={draw(1 + i * 0.06, 0.8)}
          />
        ))}
        {/* Hatch on the groove */}
        <motion.path
          d="M260 70 L272 82 M248 70 L272 94"
          strokeOpacity="0.4"
          variants={draw(1.3, 0.6)}
        />
      </motion.g>

      {/* Dimension: outer diameter */}
      <motion.g variants={fade(1.5)} strokeOpacity="0.55">
        <path d="M90 420 H430" />
        <path d="M90 412 V428 M430 412 V428" />
        <path d="M90 420 l10 -4 v8 z M430 420 l-10 -4 v8 z" fill="currentColor" stroke="none" fillOpacity="0.55" />
        <path d="M90 240 V412 M430 240 V412" strokeDasharray="3 4" strokeOpacity="0.3" />
      </motion.g>
      <motion.text variants={fade(1.6)} x="260" y="412" textAnchor="middle" className="font-mono" fontSize="11" fill="currentColor" stroke="none" fillOpacity="0.8">
        Ø 340
      </motion.text>

      {/* Leader to bore */}
      <motion.path d="M285 225 L370 150 H440" strokeOpacity="0.5" variants={draw(1.6, 0.8)} />
      <motion.text variants={fade(1.9)} x="376" y="142" className="font-mono" fontSize="11" fill="currentColor" stroke="none" fillOpacity="0.8">
        BORE Ø 52 + KEY
      </motion.text>
    </motion.svg>
  )
}
