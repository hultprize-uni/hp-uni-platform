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
  },
  {
    photo: 'hero-4', alt: 'Estudiantes en el auditorio de la UNI',
    title: 'Mínimo 1 estudiante UNI',
    body: 'Al menos una persona matriculada en la UNI.',
  },
  {
    photo: 'DSC05401', alt: 'Presentación de una solución para reducir residuos',
    title: 'Alineado con los ODS',
    body: 'Una propuesta que aporte a los Objetivos de Desarrollo Sostenible.',
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
              className="interactive-card flex flex-col items-center text-center rounded-lg border border-white/10 bg-white/[0.03] p-7"
            >
              <div className="flex w-full justify-center">
                <div className="photo-reveal relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-md"><Image src={`/fotos/${req.photo}.webp`} alt={req.alt} fill sizes="(max-width: 767px) 85vw, 360px" className="object-cover" /></div>
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

        <div className="mt-8 flex flex-col items-center gap-5 text-center rounded-lg border border-brand-pink/30 bg-brand-pink/10 p-7">
          <p className="text-lg font-medium text-white">
            ¿Listo para empezar?
          </p>
          <Button
            render={<Link href={REGISTRATION_URL} />}
            nativeButton={false}
            size="lg"
            className="min-h-16 w-full max-w-sm shrink-0 bg-brand-pink px-10 py-4 text-lg font-bold text-brand-ink hover:bg-brand-pink-2"
          >
            Inscribir Equipo
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
