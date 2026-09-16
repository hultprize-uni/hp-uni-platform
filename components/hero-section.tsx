import Link from 'next/link'
import { ArrowRight, Users, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Countdown } from '@/components/countdown'
import {
  REGISTRATION_CLOSE_ISO,
  REGISTRATION_CLOSE_LABEL,
  ROUTES,
} from '@/lib/site-config'

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-brand-ink pt-28 pb-20 sm:pt-32 sm:pb-28"
    >
      {/* Fondo tech: grid + glows de marca */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 80%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-pink/25 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-0 h-80 w-80 rounded-full bg-brand-cyan/20 blur-[120px]"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-cyan">
          <Sparkles className="size-3.5" aria-hidden="true" />
          UNICode · Universidad Nacional de Ingeniería · Sede 2026
        </div>

        <h1 className="mt-6 max-w-4xl text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Ingeniería que{' '}
          <span className="text-brand-pink">resuelve el mundo</span>, no que
          solo lo estudia.
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/70 sm:text-xl">
          Hult Prize aterriza en la UNI. Reúne a tu squad, aplica el rigor
          analítico de la casa de estudios a un reto global y convierte tu
          prototipo en una solución de impacto real y escalable.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            render={<Link href={ROUTES.registro} />}
            nativeButton={false}
            size="lg"
            className="h-12 bg-brand-pink px-6 text-base text-white hover:bg-brand-pink-2"
          >
            Inscribir mi Equipo (1-4 integrantes)
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
          <Button
            render={<Link href={ROUTES.matchmaking} />}
            nativeButton={false}
            size="lg"
            variant="outline"
            className="h-12 border-white/25 bg-transparent px-6 text-base text-white hover:bg-white/10"
          >
            <Users className="size-5" aria-hidden="true" />
            Busco Equipo (Matchmaking UNI)
          </Button>
        </div>

        {/* Countdown — información crítica destacada */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:mt-14 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-yellow">
                Cierre de inscripciones
              </p>
              <p className="mt-2 text-lg font-medium text-white">
                Las postulaciones cierran el{' '}
                <span className="font-mono text-brand-pink-3">
                  {REGISTRATION_CLOSE_LABEL}
                </span>
              </p>
              <p className="mt-1 text-sm text-white/50">
                No dejes que el reloj decida por tu equipo.
              </p>
            </div>
            <Countdown targetIso={REGISTRATION_CLOSE_ISO} />
          </div>
        </div>
      </div>
    </section>
  )
}
