import Link from 'next/link'
import { UsersRound, ArrowRight, CircuitBoard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/site-config'

export function MatchmakingSection() {
  return (
    <section id="matchmaking" className="bg-brand-ink py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-brand-cyan/25 bg-gradient-to-br from-brand-navy/60 via-brand-ink to-brand-ink p-8 sm:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-cyan/20 blur-[100px]"
          />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-4 py-1.5 text-xs font-semibold text-brand-cyan">
                <CircuitBoard className="size-3.5" aria-hidden="true" />
                Busca tu Squad
              </div>
              <h2 className="mt-5 text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
                ¿Tienes la idea pero te falta el equipo?
              </h2>
              <p className="mt-4 text-pretty text-white/70">
                El mejor código no se escribe en solitario. Publica tu perfil en
                el Tablero de Talentos UNI, descubre a quién le falta justo lo
                que tú aportas —diseño, datos, negocio, hardware— y arma un
                squad complementario antes del cierre.
              </p>
              <div className="mt-7">
                <Button
                  render={<Link href={ROUTES.matchmaking} />}
                  nativeButton={false}
                  size="lg"
                  className="h-12 bg-brand-cyan px-6 text-base text-brand-ink hover:bg-brand-cyan/90"
                >
                  <UsersRound className="size-5" aria-hidden="true" />
                  Unirme al Tablero de Talentos UNI
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Button>
              </div>
            </div>

            <ul className="grid shrink-0 gap-3 sm:grid-cols-2 lg:w-80">
              {[
                'Perfiles por especialidad y facultad',
                'Filtra por el skill que te falta',
                'Contacto directo dentro de la plataforma',
                'Equipos de 1 a 4 integrantes',
              ].map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white/80"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
