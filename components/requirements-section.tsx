import Link from 'next/link'
import { Users, GraduationCap, Target, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/section-heading'
import { ROUTES } from '@/lib/site-config'

const REQUIREMENTS = [
  {
    icon: Users,
    title: 'Equipos de 1 a 4 personas',
    body: 'Puedes postular en solitario o con un squad de hasta cuatro integrantes. Ni uno más.',
    highlight: '1–4',
  },
  {
    icon: GraduationCap,
    title: 'Mínimo 1 estudiante UNI',
    body: 'Al menos un integrante debe ser estudiante matriculado en la Universidad Nacional de Ingeniería.',
    highlight: '≥ 1 UNI',
  },
  {
    icon: Target,
    title: 'Alineado al Reto Global 2026',
    body: 'La propuesta debe responder al desafío global de la edición 2026 con foco en impacto medible.',
    highlight: 'Reto 2026',
  },
]

export function RequirementsSection() {
  return (
    <section className="bg-brand-navy/25 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Requisitos de participación"
          title="Antes de inscribirte, revisa la letra clara."
          description="Reglas simples, sin sorpresas. Si cumples estos tres puntos, tu equipo está listo para postular."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {REQUIREMENTS.map((req) => (
            <div
              key={req.title}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-pink/15 ring-1 ring-brand-pink/30">
                  <req.icon
                    className="size-6 text-brand-pink-3"
                    aria-hidden="true"
                  />
                </span>
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

        <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-brand-pink/30 bg-brand-pink/10 p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg font-medium text-white">
            ¿Cumples los requisitos? Asegura tu cupo antes del cierre.
          </p>
          <Button
            render={<Link href={ROUTES.registro} />}
            nativeButton={false}
            size="lg"
            className="h-12 shrink-0 bg-brand-pink px-6 text-base text-white hover:bg-brand-pink-2"
          >
            Inscribir Equipo
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  )
}
