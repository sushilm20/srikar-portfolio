import { MotionConfig } from 'framer-motion'
import { ReactLenis } from 'lenis/react'
import { Nav, ScrollProgress, useScrollTo } from '@/components/Nav'
import { PixelMark } from '@/components/PixelMark'
import { SideRails } from '@/components/SideRails'
import { Hero } from '@/sections/Hero'
import { Statement } from '@/sections/Statement'
import { About } from '@/sections/About'
import { Projects } from '@/sections/Projects'
import { Skills } from '@/sections/Skills'
import { Contact } from '@/sections/Contact'
import { nav, person } from '@/content'
import { useReducedMotionPref } from '@/lib/motion'
import { useFinePointer, useTileSpotlight } from '@/lib/pointer'

function Footer() {
  const scrollTo = useScrollTo()
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <a href="#top" onClick={(e) => scrollTo('top', e)} className="flex items-center gap-2.5 text-heading">
            <PixelMark className="text-blue" size={12} />
            <span className="font-medium">{person.name}</span>
          </a>
          <p className="mt-2 text-sm text-body">Engineering curiosity. Practical ideas.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={(e) => scrollTo(n.id, e)} className="text-body hover:text-heading">
              {n.label}
            </a>
          ))}
          <a href={person.github} target="_blank" rel="noreferrer" className="text-body hover:text-heading">GitHub ↗</a>
          <a href={person.linkedin} target="_blank" rel="noreferrer" className="text-body hover:text-heading">LinkedIn ↗</a>
          <a href="#top" onClick={(e) => scrollTo('top', e)} className="text-heading">Back to top ↑</a>
        </nav>
      </div>
    </footer>
  )
}

function Site({ reduced }) {
  const fine = useFinePointer()
  useTileSpotlight(fine)
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollProgress />
      <SideRails interactive={fine && !reduced} />
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero reduced={reduced} />
        <Statement reduced={reduced} />
        <About reduced={reduced} />
        <Projects reduced={reduced} />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  const reduced = useReducedMotionPref()
  return (
    <MotionConfig reducedMotion="user">
      {reduced ? (
        <Site reduced />
      ) : (
        <ReactLenis root options={{ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true, anchors: false }}>
          <Site reduced={false} />
        </ReactLenis>
      )}
    </MotionConfig>
  )
}
