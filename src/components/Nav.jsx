import { useEffect, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { Menu, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { PixelMark } from '@/components/PixelMark'
import { nav, person } from '@/content'
import { ease } from '@/lib/motion'

// Smooth in-page jumps through Lenis; native fallback when Lenis is off.
export function useScrollTo() {
  const lenis = useLenis()
  return (id, e) => {
    const el = document.getElementById(id)
    if (!el) return
    e?.preventDefault()
    if (lenis) lenis.scrollTo(el, { offset: id === 'top' ? 0 : -24, duration: 1.4, force: true })
    else el.scrollIntoView({ behavior: 'auto', block: 'start' })
    history.replaceState(null, '', id === 'top' ? location.pathname : `#${id}`)
    // Move focus for keyboard and screen-reader users.
    el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = scrollYProgress
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-blue"
      style={{ scaleX }}
    />
  )
}

export function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const els = nav.map((n) => document.getElementById(n.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => en.isIntersecting && setActive(en.target.id))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

export function Nav() {
  const scrollTo = useScrollTo()
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lenis = useLenis()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > 400 && y > prev + 4 && !open)
    if (y < prev - 4) setHidden(false)
  })

  useEffect(() => {
    if (!lenis) return
    open ? lenis.stop() : lenis.start()
  }, [open, lenis])

  const go = (id) => (e) => scrollTo(id, e)

  // Mobile menu: let the sheet close (and release its scroll lock) before jumping.
  const goFromMenu = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    setTimeout(() => scrollTo(id), 340)
  }

  return (
    <motion.header
      className="fixed inset-x-0 top-3 z-50 px-4 md:top-5"
      animate={{ y: hidden ? -110 : 0 }}
      transition={{ duration: 0.5, ease }}
    >
      <nav
        aria-label="Primary"
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full py-2 pr-2 pl-5 transition-colors duration-500 ${
          scrolled ? 'glass shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)]' : 'border border-transparent'
        }`}
      >
        <a
          href="#top"
          onClick={go('top')}
          className="flex items-center gap-2.5 text-heading"
          aria-label={`${person.name}, back to top`}
        >
          <PixelMark className="text-blue" size={14} />
          <span className="text-sm font-medium tracking-tight">{person.name}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                onClick={go(n.id)}
                aria-current={active === n.id ? 'true' : undefined}
                className="relative rounded-full px-4 py-2 text-sm text-body transition-colors hover:text-heading aria-[current]:text-heading"
              >
                {active === n.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white/[0.06]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {n.label}
              </a>
            </li>
          ))}
          <li className="ml-2">
            <Button asChild size="sm" className="rounded-full px-4">
              <a href="#contact" onClick={go('contact')}>
                Say hello <ArrowUpRight />
              </a>
            </Button>
          </li>
        </ul>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full md:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full border-l-0 bg-[#0e1117]/95 px-6 pt-20 backdrop-blur-xl sm:max-w-sm" data-lenis-prevent>
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetDescription className="sr-only">Jump to a section of the page</SheetDescription>
            <ul className="flex flex-col gap-1">
              {nav.map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease }}
                >
                  <SheetClose asChild>
                    <a
                      href={`#${n.id}`}
                      onClick={goFromMenu(n.id)}
                      className="flex items-baseline gap-4 rounded-lg py-3 text-4xl font-semibold tracking-tight text-heading"
                    >
                      <span className="font-mono text-xs text-blue">0{i + 1}</span>
                      {n.label}
                    </a>
                  </SheetClose>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex gap-3 pb-8 text-sm">
              <a href={person.github} target="_blank" rel="noreferrer" className="text-body hover:text-heading">GitHub ↗</a>
              <a href={person.linkedin} target="_blank" rel="noreferrer" className="text-body hover:text-heading">LinkedIn ↗</a>
              <a href={`mailto:${person.email}`} className="text-body hover:text-heading">Email</a>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </motion.header>
  )
}
