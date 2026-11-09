import { useLayoutEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lightbox } from '@/components/Lightbox'
import { Reveal, SectionHead } from '@/components/Reveal'
import { projects } from '@/content'
import { useMediaQuery } from '@/lib/motion'

function Shot({ image, onOpen, className = '', label, priority }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Enlarge: ${label}`}
      className={`group relative block overflow-hidden rounded-xl border bg-[#1e1f22] text-left ${className}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        width={image.w}
        height={image.h}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="h-auto w-full object-contain p-2 md:h-full md:p-3 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
      />
      <span className="glass absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <Maximize2 className="size-4 text-heading" aria-hidden="true" />
      </span>
    </button>
  )
}

function ProjectPanel({ project, onOpen, className = '' }) {
  return (
    <article
      id={project.id}
      aria-labelledby={`${project.id}-title`}
      className={`grid h-full grid-cols-1 gap-3 md:grid-cols-12 md:grid-rows-6 md:gap-4 ${className}`}
    >
      {/* The thing visitors came for: the work itself, biggest tile. */}
      <Shot
        image={project.images[0]}
        label={project.images[0].alt}
        onOpen={() => onOpen(project, 0)}
        className="md:col-span-8 md:row-span-6"
      />
      <div className="tile flex flex-col p-6 md:col-span-4 md:row-span-4 md:p-7">
        <p className="font-mono text-[clamp(3rem,6vw,5rem)] leading-none font-medium tracking-[-0.06em] text-blue">{project.n}</p>
        <h3 id={`${project.id}-title`} className="mt-auto pt-8 text-2xl leading-tight font-semibold tracking-[-0.025em] md:text-[1.9rem]">
          {project.title}
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-body">{project.body}</p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {project.tags.map((t) => (
            <Badge key={t} variant="outline" className="rounded-full border-white/15 px-2.5 py-0.5 font-mono text-[0.7rem] font-normal text-body">
              {t}
            </Badge>
          ))}
        </div>
        <Button
          variant="outline"
          className="mt-6 self-start rounded-full"
          onClick={() => onOpen(project, 0)}
          aria-label={`Open ${project.title} gallery`}
        >
          <Maximize2 /> View gallery
        </Button>
      </div>
      <Shot
        image={project.images[1]}
        label={project.images[1].alt}
        onOpen={() => onOpen(project, 1)}
        className="md:col-span-4 md:row-span-2"
      />
    </article>
  )
}

// Desktop: section pins and the three projects glide sideways as you scroll down.
function PinnedTrack({ onOpen }) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [distance, setDistance] = useState(0)
  const [current, setCurrent] = useState(0)
  const lenis = useLenis()

  // Keyboard users: tabbing into an off-screen panel scrolls it into view.
  const focusPanel = (i) => {
    const el = sectionRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const y = top + (distance * i) / (projects.length - 1)
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
    else window.scrollTo(0, y)
  }

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const smooth = scrollYProgress // Lenis does the smoothing; no second spring.
  const x = useTransform(smooth, [0, 1], [0, -distance])
  const bar = useTransform(smooth, [0, 1], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setCurrent(Math.min(projects.length - 1, Math.round(v * (projects.length - 1))))
  })

  return (
    <div ref={sectionRef} style={{ height: `calc(100svh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-20 pb-8">
        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-6 pr-[6vw] pl-[max(2rem,calc((100vw-72rem)/2+2rem))]">
          {projects.map((p, i) => (
            <div
              key={p.id}
              className="h-[min(72svh,640px)] w-[min(84vw,1080px)] shrink-0"
              onFocus={(e) => e.target.matches(':focus-visible') && focusPanel(i)}
            >
              <ProjectPanel project={p} onOpen={onOpen} />
            </div>
          ))}
        </motion.div>

        <div className="mx-auto mt-8 flex w-full max-w-6xl items-center gap-5 px-8" aria-hidden="true">
          <span className="font-mono text-xs text-heading tabular-nums">
            0{current + 1} <span className="text-body">/ 0{projects.length}</span>
          </span>
          <div className="relative h-px flex-1 bg-white/10">
            <motion.div className="absolute inset-0 origin-left bg-blue" style={{ scaleX: bar }} />
          </div>
          <span className="font-mono text-xs text-body">Scroll</span>
        </div>
      </div>
    </div>
  )
}

export function Projects({ reduced }) {
  const wide = useMediaQuery('(min-width: 1024px) and (min-height: 640px)')
  const pinned = wide && !reduced
  const [lightbox, setLightbox] = useState({ project: null, index: 0 })
  const opener = useRef(null)

  const open = (project, index) => {
    opener.current = document.activeElement
    setLightbox({ project, index })
  }

  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-24 py-24 outline-none md:py-36">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <SectionHead index="02" label="Projects" title={<span id="projects-title">Ideas, put into practice.</span>}>
          <p className="max-w-xs text-sm leading-relaxed text-body">Select any screenshot to enlarge it.</p>
        </SectionHead>
      </div>

      {pinned ? (
        <PinnedTrack onOpen={open} />
      ) : (
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 md:px-8">
          {projects.map((p) => (
            <Reveal key={p.id} amount={0.15}>
              <ProjectPanel project={p} onOpen={open} />
            </Reveal>
          ))}
        </div>
      )}

      <Lightbox
        project={lightbox.project}
        index={lightbox.index}
        onIndex={(index) => setLightbox((s) => ({ ...s, index }))}
        onClose={() => setLightbox((s) => ({ ...s, project: null }))}
        opener={opener}
      />
    </section>
  )
}
