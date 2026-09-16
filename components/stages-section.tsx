import { CalendarClock } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { GLOBAL_STAGES, LOCAL_PHASES } from '@/lib/site-config'

export function StagesSection() {
  return (
    <section
      id="cronograma"
      className="bg-brand-navy/25 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Cómo funciona la competencia"
          title="Cinco etapas globales. Cuatro fases en el campus."
          description="El camino de Hult Prize es internacional, pero tu recorrido empieza aquí, en la UNI. Primero conquistas el campus; luego escalas al mundo."
        />

        {/* Etapas globales */}
        <div className="mt-12">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-cyan">
            Ruta global de Hult Prize
          </h3>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {GLOBAL_STAGES.map((stage, i) => (
              <li
                key={stage.key}
                className="relative flex flex-col rounded-xl border border-white/10 bg-white/[0.03] p-5"
              >
                <span className="font-mono text-xs font-semibold text-brand-pink">
                  {stage.tag}
                </span>
                <span className="mt-2 text-lg font-semibold text-white">
                  {stage.title}
                </span>
                <span className="mt-2 text-sm leading-relaxed text-white/60">
                  {stage.body}
                </span>
                {i < GLOBAL_STAGES.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-gradient-to-r from-brand-pink/60 to-transparent lg:block"
                  />
                ) : null}
              </li>
            ))}
          </ol>
        </div>

        {/* Cronograma local */}
        <div className="mt-16">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-cyan">
            Tu recorrido en HP at UNI
          </h3>
          <ol className="mt-6 space-y-4">
            {LOCAL_PHASES.map((phase) => (
              <li
                key={phase.key}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:flex-row sm:items-center sm:gap-6"
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-brand-pink/15 text-lg font-bold text-brand-pink-3 ring-1 ring-brand-pink/30">
                  {phase.phase.replace('Fase ', 'F')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-lg font-semibold text-white">
                      {phase.title}
                    </h4>
                    {/* Fecha crítica destacada, nunca texto plano */}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-yellow/40 bg-brand-yellow/10 px-3 py-1 font-mono text-xs font-semibold text-brand-yellow">
                      <CalendarClock className="size-3.5" aria-hidden="true" />
                      {phase.date}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {phase.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-white/40">
            Las fechas públicas de cada fase se confirmarán próximamente y se
            actualizarán desde el gestor de contenidos.
          </p>
        </div>
      </div>
    </section>
  )
}
