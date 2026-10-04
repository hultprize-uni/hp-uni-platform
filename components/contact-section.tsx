import { ArrowUpRight, AtSign, Mail, MessageCircle, Share2 } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { CONTACT_CHANNELS } from '@/lib/site-config'

export function ContactSection() {
  return (
    <section id="contacto" className="border-t border-white/10 bg-[#201d2e] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="Contacto"
          title="Conversemos sobre Hult Prize at UNI."
          description="Los canales oficiales se publicarán cuando la organización confirme los datos de contacto de la edición."
        />
        <div className="mt-10 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
          <article className="bg-[#201d2e] p-6">
            <Mail className="size-5 text-brand-pink" aria-hidden="true" />
            <h3 className="mt-5 font-semibold text-white">Correo oficial</h3>
            {CONTACT_CHANNELS.email ? (
              <a
                href={`mailto:${CONTACT_CHANNELS.email}`}
                className="mt-2 inline-block break-all text-sm text-white/70 hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink"
              >
                {CONTACT_CHANNELS.email}
              </a>
            ) : (
              <p className="mt-2 text-sm text-white/55">Por confirmar</p>
            )}
          </article>

          <article className="bg-[#201d2e] p-6">
            <div className="flex gap-3 text-brand-pink" aria-hidden="true">
              <AtSign className="size-5" />
              <Share2 className="size-5" />
            </div>
            <h3 className="mt-5 font-semibold text-white">Redes de Hult Prize at UNI</h3>
            <div className="mt-2 flex flex-col items-start gap-2 text-sm">
              {CONTACT_CHANNELS.instagram ? (
                <a href={CONTACT_CHANNELS.instagram} target="_blank" rel="noreferrer" className="text-white/70 hover:text-brand-cyan">Instagram</a>
              ) : (
                <span className="text-white/50">Instagram · por confirmar</span>
              )}
              {CONTACT_CHANNELS.linkedin ? (
                <a href={CONTACT_CHANNELS.linkedin} target="_blank" rel="noreferrer" className="text-white/70 hover:text-brand-cyan">LinkedIn</a>
              ) : (
                <span className="text-white/50">LinkedIn · por confirmar</span>
              )}
            </div>
          </article>

          <article className="bg-[#201d2e] p-6">
            <MessageCircle className="size-5 text-brand-pink" aria-hidden="true" />
            <h3 className="mt-5 font-semibold text-white">Consultas rápidas</h3>
            {CONTACT_CHANNELS.whatsapp ? (
              <a
                href={CONTACT_CHANNELS.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink"
              >
                Abrir canal de consultas
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            ) : (
              <p className="mt-2 text-sm text-white/55">Canal rápido por confirmar</p>
            )}
          </article>
        </div>
      </div>
    </section>
  )
}
