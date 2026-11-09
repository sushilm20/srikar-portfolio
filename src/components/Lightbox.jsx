import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ease } from '@/lib/motion'

// Glass lightbox. Radix handles Esc and the focus trap; focus goes back to `opener` on close.
export function Lightbox({ project, index, onIndex, onClose, opener }) {
  const lenis = useLenis()
  const open = Boolean(project)
  const [dir, setDir] = useState(1)
  const images = project?.images ?? []
  const img = images[index]

  useEffect(() => {
    if (!lenis) return
    open ? lenis.stop() : lenis.start()
  }, [open, lenis])

  const step = useCallback(
    (d) => {
      if (!images.length) return
      setDir(d)
      onIndex((index + d + images.length) % images.length)
    },
    [images.length, index, onIndex],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, step])

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        onCloseAutoFocus={(e) => {
          // Return focus to the thumbnail or button that opened the viewer.
          e.preventDefault()
          const el = opener?.current
          requestAnimationFrame(() => el?.isConnected && el.focus({ preventScroll: true }))
        }}
        data-lenis-prevent
        className="glass flex max-h-[92svh] w-[min(1200px,calc(100vw-1.5rem))] max-w-none flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-none"
      >
        {project && (
          <>
            <div className="flex items-center justify-between gap-4 border-b px-4 py-3 md:px-5">
              <div className="min-w-0">
                <DialogTitle className="truncate text-sm font-medium text-heading">{project.title}</DialogTitle>
                <DialogDescription className="font-mono text-xs text-body">
                  Image {index + 1} of {images.length}
                </DialogDescription>
              </div>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="shrink-0 rounded-full" aria-label="Close image viewer">
                  <X className="size-5" />
                </Button>
              </DialogClose>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black/30 p-3 md:p-6">
              <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                <motion.img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  custom={dir}
                  variants={{
                    enter: (d) => ({ opacity: 0, x: d * 60, scale: 0.98 }),
                    center: { opacity: 1, x: 0, scale: 1 },
                    exit: (d) => ({ opacity: 0, x: d * -60, scale: 0.98 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease }}
                  className="max-h-[calc(92svh-9rem)] w-auto max-w-full rounded-lg object-contain"
                />
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-3 border-t px-4 py-3 md:px-5">
              <p className="line-clamp-1 text-xs text-body md:text-sm">{img.alt}</p>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="icon" className="rounded-full" onClick={() => step(-1)} aria-label="Previous image">
                  <ChevronLeft />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full" onClick={() => step(1)} aria-label="Next image">
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
