import { motion } from 'framer-motion'
import { SectionHead } from '@/components/Reveal'
import { PixelMark } from '@/components/PixelMark'
import { cadParts, skills } from '@/content'
import { reveal, stagger } from '@/lib/motion'

const Tile = ({ className = '', children, ...rest }) => (
  <motion.div variants={reveal} className={`tile flex flex-col p-6 md:p-8 ${className}`} {...rest}>
    {children}
  </motion.div>
)

const Label = ({ n, children }) => (
  <p className="eyebrow">
    <span className="text-blue">{n}</span> / {children}
  </p>
)

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 outline-none md:px-8 md:py-36">
      <SectionHead index="03" label="Skills" title={<span id="skills-title">Technical thinking. Human skills.</span>} />

      <motion.div
        className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger(0.09)}
      >
        {/* CAD: the main event, biggest tile, laid out like a drawing's parts list. */}
        <Tile className="md:col-span-7 md:row-span-2">
          <Label n="01">Design</Label>
          <h3 className="mt-10 text-[clamp(2rem,4vw,3.25rem)] leading-none font-semibold tracking-[-0.04em]">{skills.cad.title}</h3>
          <p className="mt-4 max-w-md text-body">{skills.cad.body}</p>
          <div className="mt-10 md:mt-auto md:pt-10">
            <div className="flex justify-between border-b pb-2 font-mono text-[0.7rem] tracking-[0.15em] text-body uppercase">
              <span>Item</span>
              <span>Part</span>
            </div>
            <motion.ol variants={stagger(0.06, 0.2)}>
              {cadParts.map((part, i) => (
                <motion.li
                  key={part}
                  variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
                  className="group flex items-baseline justify-between border-b py-3 transition-colors hover:border-white/25"
                >
                  <span className="font-mono text-xs text-blue tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-lg font-medium tracking-tight text-heading transition-transform duration-500 group-hover:-translate-x-1 md:text-xl">
                    {part}
                  </span>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </Tile>

        <Tile className="md:col-span-5">
          <Label n="02">Code</Label>
          <h3 className="mt-8 text-2xl font-semibold tracking-[-0.025em] md:text-3xl">{skills.programming.title}</h3>
          <ul className="mt-5 space-y-2.5">
            {skills.programming.items.map((it) => (
              <li key={it} className="flex gap-3 text-body">
                <span className="mt-[0.6em] size-1 shrink-0 bg-blue" aria-hidden="true" />
                {it}
              </li>
            ))}
          </ul>
        </Tile>

        <Tile className="md:col-span-5">
          <Label n="03">People</Label>
          <h3 className="mt-8 text-2xl font-semibold tracking-[-0.025em] md:text-3xl">{skills.leadership.title}</h3>
          <p className="mt-3 text-body">{skills.leadership.body}</p>
        </Tile>

        <Tile className="md:col-span-5">
          <Label n="04">Voice</Label>
          <h3 className="mt-8 text-2xl font-semibold tracking-[-0.025em] md:text-3xl">{skills.communication.title}</h3>
          <p className="mt-3 text-body">{skills.communication.body}</p>
        </Tile>

        <Tile className="justify-between bg-transparent md:col-span-7">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Looking ahead</p>
            <PixelMark className="text-blue" size={12} />
          </div>
          <p className="mt-10 text-[clamp(1.5rem,2.8vw,2.3rem)] leading-[1.15] font-medium tracking-[-0.025em] text-heading">
            {skills.goal}
          </p>
        </Tile>
      </motion.div>
    </section>
  )
}
