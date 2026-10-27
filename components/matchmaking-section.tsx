'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { UsersRound, ArrowUpRight, X } from 'lucide-react'
import { WHATSAPP_GROUP_URL } from '@/lib/public-content'

export function MatchmakingSection() {
  const dialog = useRef<HTMLDialogElement>(null)
  return <section id="matchmaking" className="bg-brand-ink py-12 sm:py-16"><div className="mx-auto max-w-7xl px-5 sm:px-8">
    <div className="relative overflow-hidden rounded-lg border border-brand-cyan/25 bg-gradient-to-br from-brand-navy/60 via-brand-ink to-brand-ink p-7 sm:p-12"><div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-cyan/20 blur-[100px]" />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"><div className="max-w-xl"><h2 className="text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">Encuentra a tu equipo.</h2><p className="mt-4 leading-relaxed text-white/70">Conoce estudiantes, combina habilidades y empieza a construir.</p><button type="button" onClick={() => dialog.current?.showModal()} className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-brand-cyan px-5 py-3 text-base font-semibold text-brand-ink hover:bg-brand-cyan/90"><UsersRound className="size-5" aria-hidden="true" />Buscar equipo<ArrowUpRight className="size-5" aria-hidden="true" /></button></div>
        <div className="photo-reveal relative aspect-[4/3] w-full overflow-hidden rounded-md lg:w-96 lg:shrink-0"><Image src="/fotos/DSC05426.webp" alt="Participantes comparten un encuentro en la UNI" fill sizes="(max-width: 1023px) 85vw, 384px" className="object-cover" /></div>
      </div>
    </div>
    <dialog ref={dialog} aria-labelledby="whatsapp-title" className="m-auto w-[calc(100%-2.5rem)] max-w-lg rounded-lg border border-white/20 bg-[#201d2e] p-7 text-white backdrop:bg-black/70"><div className="flex items-start justify-between gap-4"><h2 id="whatsapp-title" className="text-2xl font-semibold">Conecta con la comunidad.</h2><button type="button" onClick={() => dialog.current?.close()} aria-label="Cerrar información del grupo" className="flex size-11 shrink-0 items-center justify-center rounded border border-white/20"><X className="size-5" /></button></div>
      {WHATSAPP_GROUP_URL ? <><p className="mt-5 leading-relaxed text-white/70">El grupo de WhatsApp es un espacio para conocer participantes y formar equipo. Al abrirlo, continuarás en una plataforma externa.</p><a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-md bg-brand-cyan px-5 font-semibold text-brand-ink">Abrir grupo de WhatsApp<ArrowUpRight className="size-5" aria-hidden="true" /><span className="sr-only"> (abre en una pestaña nueva)</span></a></> : <p className="mt-5 leading-relaxed text-white/70">El enlace oficial del grupo se publicará próximamente. Mientras tanto, puedes revisar los requisitos y las preguntas frecuentes de la convocatoria.</p>}
    </dialog>
  </div></section>
}
