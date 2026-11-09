import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { SectionHead } from '@/components/Reveal'
import { useScrollTo } from '@/components/Nav'
import { about, stats } from '@/content'
import { ease, stagger, reveal } from '@/lib/motion'

function CountUp({ value, reduced }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const target = parseInt(value, 10)
  const suffix = value.replace(String(target), '')
  const [n, setN] = useState(reduced ? target : 0)

  useEffect(() => {
    if (!inView || reduced) return
    const c = animate(0, target, { duration: 1.4, ease, onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView, reduced, target])

  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden="true">
        {n}
        <span className="text-blue">{suffix}</span>
      </span>
    </span>
  )
}

function Stat({ stat, className, reduced }) {
  return (
    <motion.div variants={reveal} className={`tile flex flex-col justify-between p-6 md:p-7 ${className}`}>
      <p className="text-[clamp(4rem,9vw,7.5rem)] leading-[0.85] font-semibold tracking-[-0.06em] text-heading">
        <CountUp value={stat.value} reduced={reduced} />
      </p>
      <p className="mt-6 max-w-[16rem] text-sm leading-snug text-body">{stat.label}</p>
    </motion.div>
  )
}

function Block({ item, className, big }) {
  return (
    <motion.article
      variants={reveal}
      className={`tile group flex flex-col p-6 transition-colors duration-500 hover:border-white/20 md:p-8 ${className}`}
    >
      <p className="eyebrow">
        <span className="text-blue">{item.n}</span> / {item.title}
      </p>
      <p
        className={
          big
            ? 'mt-auto pt-16 text-[clamp(1.4rem,2.6vw,2.2rem)] leading-[1.2] font-medium tracking-[-0.02em] text-heading'
            : 'mt-auto pt-10 text-base leading-relaxed text-body md:text-[1.05rem]'
        }
      >
        {item.body}
      </p>
    </motion.article>
  )
}

export function About({ reduced }) {
  const scrollTo = useScrollTo()
  const [background, education, experience, outside] = about

  return (
    <section id="about" aria-labelledby="about-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 outline-none md:px-8 md:py-36">
      <SectionHead
        index="01"
        label="About"
        title={<span id="about-title">A curious mind. An engineering direction.</span>}
      >
        <a
          href="#projects"
          onClick={(e) => scrollTo('projects', e)}
          className="inline-flex items-center gap-1.5 text-sm text-heading underline-offset-4 hover:underline"
        >
          See what I've built <ArrowUpRight className="size-4" />
        </a>
      </SectionHead>

      <motion.div
        className="grid auto-rows-[minmax(11rem,auto)] grid-cols-1 gap-3 md:grid-cols-6 md:gap-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger(0.09)}
      >
        <Block item={background} big className="md:col-span-4 md:row-span-2" />
        <Stat stat={stats[0]} className="md:col-span-2" reduced={reduced} />
        <Stat stat={stats[1]} className="md:col-span-2" reduced={reduced} />
        <Block item={education} className="md:col-span-3" />
        <Block item={experience} className="md:col-span-3" />
        <Block item={outside} className="md:col-span-4" />
        <Stat stat={stats[2]} className="md:col-span-2" reduced={reduced} />
      </motion.div>
    </section>
  )
}

