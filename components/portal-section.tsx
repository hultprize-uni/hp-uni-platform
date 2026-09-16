import Link from 'next/link'
import { UploadCloud, ClipboardCheck, ArrowUpRight, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/section-heading'
import { ROUTES } from '@/lib/site-config'

export function PortalSection() {
  return (
    <section className="bg-brand-ink py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Portal de Participantes"
          title="Una plataforma, no un formulario perdido en un correo."
          description="Tras inscribirte, tu equipo entra a un portal propio: ahí subes entregables y el jurado los evalúa con rúbricas. Todo trazable, todo en un solo lugar."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {/* Equipos */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-8">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-cyan/15 ring-1 ring-brand-cyan/30">
              <UploadCloud
                className="size-6 text-brand-cyan"
                aria-hidden="true"
              />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-white">
              Para tu equipo
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Sube tus entregables en PDF o DOCX y enlaza tu pitch en video.
              Controla versiones, fechas límite y el estado de cada entrega sin
              perseguir a nadie.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {['PDF', 'DOCX', 'Enlace a video', 'Historial de versiones'].map(
                (tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70"
                  >
                    {tag}
                  </li>
                ),
              )}
            </ul>
            <div className="mt-6">
              <Button
                render={<Link href={ROUTES.portalEntregables} />}
                nativeButton={false}
                variant="outline"
                className="border-white/25 bg-transparent text-white hover:bg-white/10"
              >
                Portal de Entregables
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Jurado */}
          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-8">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-pink/15 ring-1 ring-brand-pink/30">
              <ClipboardCheck
                className="size-6 text-brand-pink-3"
                aria-hidden="true"
              />
            </span>
            <h3 className="mt-5 text-xl font-semibold text-white">
              Para el jurado
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              Acceso diferenciado a un panel con rúbricas, pitch decks en video,
              documentos y casillas de puntaje. Evaluación consistente y
              auditable para cada equipo.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-white/50">
              <Shield className="size-4 text-brand-pink" aria-hidden="true" />
              Acceso restringido por rol
            </div>
            <div className="mt-6">
              <Button
                render={<Link href={ROUTES.accesoJurado} />}
                nativeButton={false}
                variant="outline"
                className="border-white/25 bg-transparent text-white hover:bg-white/10"
              >
                Acceso Jurado
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
