import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Blueprint } from '@/components/Blueprint'
import { useScrollTo } from '@/components/Nav'
import { person } from '@/content'
import { ease } from '@/lib/motion'

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
  const scrollTo = useScrollTo()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  const still = (v) => (reduced ? v[0] : v)
  const nameScale = useTransform(p, [0, 0.7], still([1, 0.86]))
  const nameY = useTransform(p, [0, 0.7], still([0, -60]))
  const fadeOut = useTransform(p, [0.25, 0.7], reduced ? [1, 1] : [1, 0])
  const copyY = useTransform(p, [0, 0.6], still([0, -90]))
  const bpY = useTransform(p, [0, 1], still([0, 220]))
  const bpScale = useTransform(p, [0, 1], still([1, 1.25]))
  const bpOpacity = useTransform(p, [0, 0.85], reduced ? [1, 1] : [1, 0.15])

  return (
    <section id="top" ref={ref} aria-label="Introduction" className={reduced ? 'relative' : 'relative h-[170svh]'}>
      <div className="sticky top-0 flex min-h-svh flex-col overflow-hidden">
        <div className="blueprint-grid pointer-events-none absolute inset-0" aria-hidden="true" />

        {/* Parallax blueprint */}
        <motion.div
          className="pointer-events-none absolute top-[14%] right-[-18%] w-[95vw] max-w-[640px] text-heading/80 sm:right-[-6%] md:top-[12%] md:right-[2%] md:w-[52vw]"
          style={{ y: bpY, scale: bpScale, opacity: bpOpacity }}
        >
          <Blueprint progress={p} reduced={reduced} />
        </motion.div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-4 pt-32 pb-14 md:px-8 md:pb-20">
          <motion.p
            className="eyebrow mb-6 md:mb-8"
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
      </div>
    </section>
  )
}
