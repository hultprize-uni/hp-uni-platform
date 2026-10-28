import { SectionHeading } from '@/components/section-heading'
import { BOOTCAMP_MODULES } from '@/lib/site-config'

export function BootcampSection() {
  return (
    <section id="bootcamp" className="bg-brand-ink py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="Bootcamp Hult Prize at UNI"
          title="Aprende. Prueba. Presenta."
          description="Bootcamp · programa por confirmar."
        />
        <ol className="mt-10 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 md:grid-cols-4">
          {BOOTCAMP_MODULES.map((module) => (
            <li key={module.number} className="interactive-card grid grid-rows-[auto_1fr] bg-brand-ink p-6 text-center">
              <h3 className="flex min-h-14 items-start justify-center text-lg font-semibold leading-7 text-white">{module.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{module.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
