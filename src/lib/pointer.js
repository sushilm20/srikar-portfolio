import { useEffect } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { useMediaQuery } from '@/lib/motion'

// True on devices with a real mouse/trackpad. Touch devices skip cursor effects.
export function useFinePointer() {
  return useMediaQuery('(hover: hover) and (pointer: fine)')
}

// Pointer position relative to an element, as motion values.
// x/y are in px inside the element; nx/ny are normalised -0.5..0.5; `inside` is 0 or 1.
export function useLocalPointer(ref, { enabled = true, spring = { stiffness: 220, damping: 30, mass: 0.4 } } = {}) {
  const x = useMotionValue(-9999)
  const y = useMotionValue(-9999)
  const nx = useMotionValue(0)
  const ny = useMotionValue(0)
  const inside = useMotionValue(0)
  const sx = useSpring(x, spring)
  const sy = useSpring(y, spring)
  const snx = useSpring(nx, { stiffness: 90, damping: 20, mass: 0.6 })
  const sny = useSpring(ny, { stiffness: 90, damping: 20, mass: 0.6 })
  const sInside = useSpring(inside, { stiffness: 120, damping: 24 })

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    let first = true
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const px = e.clientX - r.left
      const py = e.clientY - r.top
      const isIn = px >= 0 && py >= 0 && px <= r.width && py <= r.height
      if (first) {
        // Jump straight to the cursor the first time so the glow doesn't fly in from a corner.
        sx.jump(px)
        sy.jump(py)
        first = false
      }
      x.set(px)
      y.set(py)
      nx.set(px / r.width - 0.5)
      ny.set(py / r.height - 0.5)
      inside.set(isIn ? 1 : 0)
    }
    const leave = () => {
      inside.set(0)
      nx.set(0)
      ny.set(0)
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [ref, enabled, x, y, nx, ny, inside, sx, sy])

  return { x, y, sx, sy, nx: snx, ny: sny, inside: sInside }
}

// One delegated listener feeds --x/--y to whichever .tile is under the cursor (CSS spotlight).
export function useTileSpotlight(enabled) {
  useEffect(() => {
    if (!enabled) return
    const move = (e) => {
      const tile = e.target instanceof Element ? e.target.closest('.tile') : null
      if (!tile) return
      const r = tile.getBoundingClientRect()
      tile.style.setProperty('--x', `${e.clientX - r.left}px`)
      tile.style.setProperty('--y', `${e.clientY - r.top}px`)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [enabled])
}
