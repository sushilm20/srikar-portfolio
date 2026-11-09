import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Blueprint } from '@/components/Blueprint'
import { useScrollTo } from '@/components/Nav'
import { CornerMarks, Crosshair, GridGlow } from '@/components/HeroFX'
import { person } from '@/content'
import { ease } from '@/lib/motion'
import { useFinePointer, useLocalPointer } from '@/lib/pointer'

function SplitWord({ word, delay }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      {word.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ delay: delay + i * 0.035, duration: 1.1, ease }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

export function Hero({ reduced }) {
  const ref = useRef(null)
  const stageRef = useRef(null)
  const scrollTo = useScrollTo()
  const fine = useFinePointer()
  const interactive = fine && !reduced
  const pointer = useLocalPointer(stageRef, { enabled: interactive })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // Lenis already smooths the wheel; scroll-linked values follow it 1:1.
  const p = scrollYProgress

  const still = (v) => (reduced ? v[0] : v)
  const nameScale = useTransform(p, [0, 0.7], still([1, 0.86]))
  const nameY = useTransform(p, [0, 0.7], still([0, -60]))
  const fadeOut = useTransform(p, [0.25, 0.7], reduced ? [1, 1] : [1, 0])
  const copyY = useTransform(p, [0, 0.6], still([0, -90]))
  const bpY = useTransform(p, [0, 1], still([0, 220]))
  const bpScale = useTransform(p, [0, 1], still([1, 1.25]))
  const bpOpacity = useTransform(p, [0, 0.85], reduced ? [1, 1] : [1, 0.15])

  // The drawing leans toward the cursor and drifts against it (depth parallax).
  const tiltY = useTransform(pointer.nx, [-0.5, 0.5], interactive ? [-14, 14] : [0, 0])
  const tiltX = useTransform(pointer.ny, [-0.5, 0.5], interactive ? [10, -10] : [0, 0])
  const driftX = useTransform(pointer.nx, [-0.5, 0.5], interactive ? [24, -24] : [0, 0])
  const driftY = useTransform(pointer.ny, [-0.5, 0.5], interactive ? [18, -18] : [0, 0])

  return (
    <section id="top" ref={ref} aria-label="Introduction" className={reduced ? 'relative' : 'relative h-[170svh]'}>
      <div ref={stageRef} className="sticky top-0 flex min-h-svh flex-col overflow-hidden">
        <div className="blueprint-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        {interactive && <GridGlow pointer={pointer} />}
        <CornerMarks />

        {/* Parallax blueprint */}
        <motion.div
          className="pointer-events-none absolute top-[9%] left-1/2 w-[78vw] max-w-[640px] -translate-x-1/2 text-heading/70 md:top-[12%] md:right-[2%] md:left-auto md:w-[52vw] md:translate-x-0 md:text-heading/80"
          style={{ y: bpY, scale: bpScale, opacity: bpOpacity }}
        >
          <motion.div style={{ rotateX: tiltX, rotateY: tiltY, x: driftX, y: driftY, transformPerspective: 1100 }}>
            <Blueprint progress={p} reduced={reduced} />
          </motion.div>
        </motion.div>

        {interactive && <Crosshair pointer={pointer} />}

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-4 pt-[62vw] pb-16 md:px-8 md:pt-32 md:pb-24">
          <motion.p
            className="eyebrow mb-6 tracking-[0.12em] md:mb-8 md:tracking-[0.18em]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease }}
          >
            <span className="mr-2 inline-block size-1.5 translate-y-[-2px] bg-blue align-middle" aria-hidden="true" />
            {person.eyebrow}
          </motion.p>

          <motion.h1
            className="origin-bottom-left text-[clamp(3.6rem,13.5vw,11.5rem)] leading-[0.86] font-semibold tracking-[-0.055em] text-heading"
            style={{ scale: nameScale, y: nameY }}
          >
            <span className="sr-only">{person.name}</span>
            <span aria-hidden="true" className="block">
              <SplitWord word={person.first} delay={0.15} />
            </span>
            <span aria-hidden="true" className="block">
              <SplitWord word={person.last} delay={0.3} />
              <motion.span
                className="text-blue"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                .
              </motion.span>
            </span>
          </motion.h1>

          <motion.div
            className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12 md:items-end"
            style={{ y: copyY, opacity: fadeOut }}
          >
            <motion.div
              className="md:col-span-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1, ease }}
            >
              <p className="text-2xl font-medium tracking-tight text-heading md:text-3xl">{person.headline}</p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-body md:text-lg">{person.lead}</p>
            </motion.div>
            <motion.div
              className="flex flex-wrap gap-3 md:col-span-6 md:justify-end"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 1, ease }}
            >
              <Button asChild size="lg" className="h-12 rounded-full px-6 text-[0.95rem]">
                <a href="#projects" onClick={(e) => scrollTo('projects', e)}>
                  Explore my projects <ArrowUpRight />
                </a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="h-12 rounded-full px-6 text-[0.95rem] text-heading">
                <a href="#about" onClick={(e) => scrollTo('about', e)}>
                  A little about me <ArrowDown />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {!reduced && (
          <motion.div
            aria-hidden="true"
            className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
            style={{ opacity: fadeOut }}
          >
            <span className="font-mono text-[0.65rem] tracking-[0.25em] text-body uppercase">Scroll</span>
            <span className="relative h-10 w-px overflow-hidden bg-white/10">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-blue"
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
          </motion.div>
        )}
      </div>
    </section>
  )
}
