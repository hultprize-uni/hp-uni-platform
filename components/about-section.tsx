import { Cpu, Rocket, Globe } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { SectionHeading } from '@/components/section-heading'

const PILLARS = [
  {
    icon: Cpu,
    title: 'Ingeniería de Impacto',
    body: 'No premiamos slides bonitos. Traducimos el método de la UNI —medir, modelar, iterar— en soluciones que aguantan datos reales y usuarios reales.',
    accent: 'text-brand-cyan',
    ring: 'ring-brand-cyan/30',
  },
  {
    icon: Rocket,
    title: 'Emprendimiento Escalable',
    body: 'Pasamos del prototipo al modelo operable: unit economics, tracción y una hipótesis de crecimiento que un inversionista pueda tomarse en serio.',
    accent: 'text-brand-pink',
    ring: 'ring-brand-pink/30',
  },
  {
    icon: Globe,
    title: 'Acceso a Red Global',
    body: 'Hult Prize conecta tu equipo con mentores, aceleradoras y campus de todo el mundo. Tu proyecto UNI compite en una liga internacional.',
    accent: 'text-brand-yellow',
    ring: 'ring-brand-yellow/30',
  },
]

export function AboutSection() {
  return (
    <section
      id="sobre-el-reto"
      className="bg-brand-ink py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="¿Qué es Hult Prize at UNI?"
          title="El reto global que le queda perfecto a un ingeniero."
          description="Hult Prize es la competencia de emprendimiento social más reconocida entre universidades. En su edición 2026 tiene como anfitriona a la Universidad Nacional de Ingeniería, que aporta su ADN técnico y analítico para atacar problemas que le importan al planeta."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <Card
              key={pillar.title}
              className="group border-white/10 bg-white/[0.03] p-7 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div
                className={`inline-flex size-12 items-center justify-center rounded-xl bg-white/5 ring-1 ${pillar.ring}`}
              >
                <pillar.icon
                  className={`size-6 ${pillar.accent}`}
                  aria-hidden="true"
                />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">
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
                Sede anfitriona · 2026
              </p>
              <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                La UNI pone la casa —y el rigor.
              </h3>
              <p className="mt-3 text-pretty text-white/70">
                Ser sede no es un logo en un banner. Significa laboratorios,
                comunidad y una forma de pensar en la que ninguna solución se
                da por válida hasta que se demuestra. Ese es el estándar
                UNICode que traemos a la competencia.
              </p>
            </div>
            <dl className="grid grid-cols-3 gap-4 lg:shrink-0">
              {[
                { n: '01', l: 'Campus sede' },
                { n: '05', l: 'Etapas globales' },
                { n: '1-4', l: 'Integrantes' },
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
