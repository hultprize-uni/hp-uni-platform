import { Card } from '@/components/ui/card'
import { SectionHeading } from '@/components/section-heading'

const PILLARS = [
  {
    title: 'Emprendimiento con propósito',
    body: 'Convierte un desafío social o ambiental en una propuesta de negocio sostenible, con impacto medible y potencial de crecimiento.',
  },
  {
    title: 'Validación de soluciones',
    body: 'Investiga necesidades, contrasta hipótesis con personas usuarias y desarrolla una solución basada en evidencia.',
  },
  {
    title: 'Comunidad global',
    body: 'Comparte el trabajo de tu equipo con una comunidad universitaria internacional enfocada en innovación y emprendimiento de impacto.',
  },
]

export function AboutSection() {
  return (
    <section
      id="about"
      className="bg-brand-ink py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="¿Qué es Hult Prize?"
          title="Emprendimiento universitario para desafíos globales."
          description="Hult Prize es una competencia universitaria que impulsa a estudiantes a crear empresas sostenibles capaces de responder a desafíos sociales y ambientales. En 2027, la comunidad UNI podrá desarrollar y presentar propuestas alineadas con el reto global de la edición."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <Card
              key={pillar.title}
              className="group border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
              <h3 className="text-xl font-semibold text-white">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {pillar.body}
              </p>
            </Card>
          ))}
        </div>

        {/* Bloque anfitriona UNI */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-brand-navy/60 bg-brand-navy/40 p-7 sm:p-9">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">
                Sede UNI · Edición 2027
              </p>
              <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                Innovación con base técnica y compromiso social.
              </h3>
              <p className="mt-3 text-pretty text-white/70">
                La Universidad Nacional de Ingeniería reúne talento de distintas
                disciplinas para investigar problemas, construir prototipos y
                evaluar su viabilidad en contextos reales.
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-4 lg:shrink-0">
              {[
                { n: '2027', l: 'Edición' },
                { n: 'UNI', l: 'Sede local' },
                { n: 'ODS', l: 'Impacto' },
              ].map((stat) => (
                <div
                  key={stat.l}
                  className="rounded-xl border border-white/10 bg-brand-ink/50 px-4 py-4 text-center"
                >
                  <dt className="sr-only">{stat.l}</dt>
                  <dd className="font-mono text-2xl font-bold text-brand-pink-3">
                    {stat.n}
                  </dd>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-wide text-white/55">
                    {stat.l}
                  </p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
