import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { statement } from '@/content'

// Apple-style "read as you scroll": each word lights up as the section passes.
function Word({ children, progress, range, reduced }) {
  const opacity = useTransform(progress, range, reduced ? [1, 1] : [0.14, 1])
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  )
}

export function Statement({ reduced }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.6'] })
  const words = statement.split(' ')

  return (
    <section ref={ref} aria-label="In short" className="mx-auto max-w-6xl px-4 py-[18vh] md:px-8 md:py-[24vh]">
      <p className="max-w-5xl text-[clamp(2rem,5.4vw,4.6rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-heading">
        {words.map((w, i) => {
          const start = i / words.length
          return (
            <Word key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]} reduced={reduced}>
              {w}
            </Word>
          )
        })}
      </p>
    </section>
  )
}
