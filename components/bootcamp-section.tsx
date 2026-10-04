import { SectionHeading } from '@/components/section-heading'
import { BOOTCAMP_MODULES } from '@/lib/site-config'

export function BootcampSection() {
  return (
    <section id="bootcamp" className="bg-brand-ink py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="Bootcamp Hult Prize at UNI"
          title="Herramientas para convertir una idea en una propuesta viable."
          description="Módulos de referencia para acompañar a los equipos durante la convocatoria. El programa definitivo se confirmará con la organización."
        />
        <ol className="mt-10 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {BOOTCAMP_MODULES.map((module) => (
            <li key={module.number} className="bg-brand-ink p-6">
              <span className="font-mono text-sm font-semibold text-brand-pink">
                {module.number}
              </span>
              <h3 className="mt-6 text-lg font-semibold text-white">{module.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{module.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
