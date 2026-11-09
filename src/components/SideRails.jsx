import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useMotionValue } from 'framer-motion'
import { useActiveSection } from '@/components/Nav'
import { nav } from '@/content'

const LABELS = { top: 'Index', ...Object.fromEntries(nav.map((n) => [n.id, n.label])) }
const INDEX = { top: '00', about: '01', projects: '02', skills: '03', contact: '04' }

// Engineering rulers down both edges (wide screens only). The tick marks travel with the
// scroll, the left rail names the current section, and a marker on the right follows the cursor.
export function SideRails({ interactive }) {
  const active = useActiveSection() || 'top'
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const [pct, setPct] = useState(0)
  const { scrollY, scrollYProgress } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const v = `${-(y * 0.35) % 64}px`
    leftRef.current?.style.setProperty('--ruler-y', v)
    rightRef.current?.style.setProperty('--ruler-y', v)
  })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setPct(Math.round(v * 100)))

  const cursorY = useMotionValue(-100)
  const markerY = useSpring(cursorY, { stiffness: 300, damping: 32, mass: 0.3 })
  useEffect(() => {
    if (!interactive) return
    const move = (e) => cursorY.set(e.clientY)
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [interactive, cursorY])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 hidden xl:block">
      {/* Left rail */}
      <div ref={leftRef} className="ruler ruler-left absolute inset-y-0 left-0 w-6 border-r border-white/[0.05]" />
      <div className="absolute top-1/2 left-9 origin-left -translate-y-1/2">
        <div className="flex -rotate-90 items-center gap-3 font-mono text-[10px] tracking-[0.25em] whitespace-nowrap text-body/60 uppercase">
          <span className="text-blue">{INDEX[active]}</span>
          <span className="h-px w-6 bg-white/20" />
          <motion.span key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {LABELS[active]}
          </motion.span>
        </div>
      </div>

      {/* Right rail */}
      <div ref={rightRef} className="ruler ruler-right absolute inset-y-0 right-0 w-6 border-l border-white/[0.05]" />
      {interactive && (
        <motion.div className="absolute right-0 flex items-center" style={{ y: markerY, top: -4 }}>
          <span className="h-px w-4 bg-blue" />
          <span className="size-1.5 -translate-x-px rotate-45 border border-blue bg-background" />
          <span className="h-px w-6 bg-blue/60" />
        </motion.div>
      )}
      <div className="absolute right-9 bottom-8 font-mono text-[10px] tracking-[0.2em] text-body/60 tabular-nums">
        <span className="text-heading/80">{String(pct).padStart(3, '0')}</span>%
      </div>
      <div className="absolute top-24 right-9 font-mono text-[10px] tracking-[0.2em] text-body/40">DWG · SM-01</div>
    </div>
  )
}
