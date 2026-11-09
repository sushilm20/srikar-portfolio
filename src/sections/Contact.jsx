import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Check, Copy, Download, FileClock, Mail, RotateCcw, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Github, Linkedin } from '@/components/BrandIcons'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { SectionHead } from '@/components/Reveal'
import { person, resume } from '@/content'
import { reveal, stagger, ease } from '@/lib/motion'

const FORM_ACTION = `https://formsubmit.co/${person.email}`
const FORM_AJAX = `https://formsubmit.co/ajax/${person.email}`

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email)
    } catch {
      const t = document.createElement('textarea')
      t.value = person.email
      document.body.appendChild(t)
      t.select()
      document.execCommand('copy')
      t.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <Button variant="outline" size="sm" className="rounded-full" onClick={copy} aria-label={copied ? 'Email address copied' : 'Copy email address'}>
      {copied ? <Check /> : <Copy />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </Button>
  )
}

function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data._honey) return // bot
    setStatus('sending')
    // Never leave the visitor on "Sending…": give up after 15s and offer the fallback.
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 15000)
    try {
      const res = await fetch(FORM_AJAX, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
        signal: ctrl.signal,
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || String(json.success) !== 'true') throw new Error(json.message || 'Send failed')
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    } finally {
      clearTimeout(timer)
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === 'sent' ? (
        <motion.div
          key="sent"
          role="status"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex h-full flex-col items-start justify-center py-10"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-6" />
          </span>
          <p className="mt-6 text-2xl font-semibold tracking-tight text-heading">Message sent. Thank you.</p>
          <p className="mt-2 text-body">I'll get back to you at the email you gave.</p>
          <Button variant="ghost" className="mt-6 rounded-full" onClick={() => setStatus('idle')}>
            Send another
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          action={FORM_ACTION}
          method="POST"
          onSubmit={onSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid gap-5"
        >
          <input type="hidden" name="_subject" value="New message from Srikar's portfolio" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-heading">Name</Label>
              <Input id="name" name="name" required autoComplete="name" className="h-12 rounded-xl bg-background/60 px-4" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-heading">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" className="h-12 rounded-xl bg-background/60 px-4" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message" className="text-heading">Message</Label>
            <Textarea id="message" name="message" required rows={5} className="min-h-36 rounded-xl bg-background/60 px-4 py-3" />
          </div>

          {status === 'error' && (
            <div role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-heading">
              That didn't go through. Try again, or email me directly at{' '}
              <a href={`mailto:${person.email}`} className="text-blue underline underline-offset-4">{person.email}</a>.
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="lg" className="h-12 rounded-full px-7" disabled={status === 'sending'}>
              {status === 'error' ? <RotateCcw /> : <Send />}
              {status === 'sending' ? 'Sending…' : status === 'error' ? 'Retry' : 'Send message'}
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  )
}

const LinkRow = ({ href, icon: Icon, label, sub, external }) => (
  <a
    href={href}
    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    className="group flex items-center justify-between gap-4 border-b py-4 transition-colors last:border-b-0 hover:border-white/25"
  >
    <span className="flex items-center gap-3">
      <Icon className="size-5 text-blue" aria-hidden="true" />
      <span>
        <span className="block font-medium text-heading">{label}</span>
        <span className="block text-sm text-body">{sub}</span>
      </span>
    </span>
    <ArrowUpRight className="size-5 text-body transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-heading" aria-hidden="true" />
    {external && <span className="sr-only">(opens in a new tab)</span>}
  </a>
)

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 outline-none md:px-8 md:py-36">
      <SectionHead index="04" label="Contact" title={<span id="contact-title">Good projects start with a conversation.</span>} />

      <motion.div
        className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger(0.1)}
      >
        <motion.div variants={reveal} className="tile p-6 md:col-span-7 md:row-span-2 md:p-8">
          <p className="eyebrow mb-6">Write to me</p>
          <ContactForm />
        </motion.div>

        <motion.div variants={reveal} className="tile p-6 md:col-span-5 md:p-8">
          <p className="eyebrow">Email</p>
          <a href={`mailto:${person.email}`} className="mt-4 block text-[clamp(1.4rem,2.6vw,2rem)] font-semibold tracking-[-0.03em] break-all text-heading hover:text-blue">
            {person.email}
          </a>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild size="sm" className="rounded-full">
              <a href={`mailto:${person.email}`}><Mail /> Email me</a>
            </Button>
            <CopyEmail />
          </div>
        </motion.div>

        <motion.div variants={reveal} className="tile px-6 py-2 md:col-span-5 md:px-8">
          <LinkRow href={person.github} icon={Github} label="GitHub" sub="SriM90" external />
          <LinkRow href={person.linkedin} icon={Linkedin} label="LinkedIn" sub="Srikar Mattegunta" external />
          {resume.available ? (
            <a href={resume.href} download className="group flex items-center justify-between gap-4 py-4">
              <span className="flex items-center gap-3">
                <Download className="size-5 text-blue" aria-hidden="true" />
                <span>
                  <span className="block font-medium text-heading">Download résumé</span>
                  <span className="block text-sm text-body">PDF</span>
                </span>
              </span>
              <ArrowUpRight className="size-5 text-body group-hover:text-heading" aria-hidden="true" />
            </a>
          ) : (
            <div className="flex items-center gap-3 py-4" aria-disabled="true">
              <FileClock className="size-5 text-body" aria-hidden="true" />
              <span>
                <span className="block font-medium text-heading">Résumé coming soon</span>
                <span className="block text-sm text-body">Email me for a copy in the meantime</span>
              </span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}
