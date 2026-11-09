import { motion } from 'framer-motion'
import { reveal } from '@/lib/motion'

// Scroll-triggered reveal. MotionConfig reducedMotion="user" strips the movement.
export function Reveal({ as = 'div', className, children, delay = 0, amount = 0.3, ...rest }) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: reveal.hidden,
        show: { ...reveal.show, transition: { ...reveal.show.transition, delay } },
      }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

export function SectionHead({ index, label, title, children, className = '' }) {
  return (
    <div className={`mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end ${className}`}>
      <Reveal className="md:col-span-8">
        <p className="eyebrow mb-5">
          <span className="text-blue">{index}</span> / {label}
        </p>
        <h2 className="text-[clamp(2.4rem,6vw,5rem)] leading-[0.98] font-semibold tracking-[-0.035em]">
          {title}
        </h2>
      </Reveal>
      {children && (
        <Reveal className="md:col-span-4 md:justify-self-end" delay={0.1}>
          {children}
        </Reveal>
      )}
    </div>
  )
}
