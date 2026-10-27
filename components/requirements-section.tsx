import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/section-heading'
import { REGISTRATION_URL } from '@/lib/public-content'

const REQUIREMENTS = [
  {
    photo: 'DSC05426', alt: 'Participantes reunidos en la UNI',
    title: 'Equipos de 1 a 4 personas',
    body: 'Participa solo o con hasta tres personas más.',
    highlight: '1–4',
  },
  {
    photo: 'hero-4', alt: 'Estudiantes en el auditorio de la UNI',
    title: 'Mínimo 1 estudiante UNI',
    body: 'Al menos una persona matriculada en la UNI.',
    highlight: '≥ 1 UNI',
  },
  {
    photo: 'DSC05401', alt: 'Presentación de una solución para reducir residuos',
    title: 'Alineado con los ODS',
    body: 'Una propuesta que aporte a los Objetivos de Desarrollo Sostenible.',
    highlight: 'ODS',
  },
]

export function RequirementsSection() {
  return (
    <section id="requisitos" className="bg-brand-navy/25 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="Requisitos de participación"
          title="Lo que necesitas."
          description="Revisa las bases oficiales antes de postular."
        />

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {REQUIREMENTS.map((req) => (
            <div
              key={req.title}
              className="flex flex-col rounded-lg border border-white/10 bg-white/[0.03] p-7"
            >
              <div className="flex items-center justify-between">
                <div className="photo-reveal relative h-28 w-40 overflow-hidden rounded-md"><Image src={`/fotos/${req.photo}.webp`} alt={req.alt} fill sizes="160px" className="object-cover" /></div>
                <span className="rounded-lg bg-white/5 px-3 py-1 font-mono text-sm font-semibold text-brand-cyan">
                  {req.highlight}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {req.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                {req.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 rounded-lg border border-brand-pink/30 bg-brand-pink/10 p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-medium text-white">
            ¿Listo para empezar?
          </p>
          <Button
            render={<Link href={REGISTRATION_URL} />}
            nativeButton={false}
            size="lg"
            className="h-12 shrink-0 bg-brand-pink px-6 text-base text-brand-ink hover:bg-brand-pink-2"
          >
            Inscribir Equipo
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
