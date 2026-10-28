'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { LOCAL_PHASES } from '@/lib/site-config'

export function StagesSection({ detailed = false }: { detailed?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [selected, setSelected] = useState<(typeof LOCAL_PHASES)[number]>(LOCAL_PHASES[0])
  function showPhase(phase: (typeof LOCAL_PHASES)[number]) { setSelected(phase); dialog.current?.showModal() }
  return <section id="cronograma" className="bg-brand-navy/25 py-12 sm:py-16"><div className="mx-auto max-w-7xl px-5 sm:px-8">
    <SectionHeading title="Tu camino a la final." description="Cuatro etapas. Fechas por confirmar." />
    <ol className="journey-track relative mt-8 grid gap-8 border-l border-white/20 pl-6 md:grid-cols-2 md:border-l-0 md:pl-0 xl:grid-cols-4">{LOCAL_PHASES.map((phase, index) => <li key={phase.key} className="interactive-card stage-card relative min-w-0 text-center md:border-t md:border-white/20 md:pt-7">
      <span className="absolute -left-[29px] top-1 size-2.5 rounded-full bg-brand-pink md:-top-1.5 md:left-0" aria-hidden="true" />
      <p className="text-sm font-medium text-brand-pink-3">0{index + 1}<span className="ml-3 text-white/55">{phase.dateRange}</span></p>
      <div className="photo-reveal relative mt-5 aspect-[16/10] overflow-hidden rounded-md border border-white/10 bg-brand-ink"><Image src={phase.image} alt="" fill sizes="(max-width: 767px) 90vw, (max-width: 1279px) 45vw, 25vw" className="object-cover" /></div>
      <h3 className="mt-5 text-xl font-semibold text-white">{phase.title}</h3><p className="mt-3 text-sm leading-relaxed text-white/65">{phase.body}</p>
      {detailed ? <p className="mt-4 text-sm leading-relaxed text-white/65">{phase.details}</p> : <button type="button" onClick={() => showPhase(phase)} className="mt-3 min-h-11 text-sm font-medium text-brand-pink-3 hover:text-white">Ver detalles de {phase.phase.toLowerCase()}</button>}
    </li>)}</ol>
    {!detailed && <Link href="/cronograma" className="mx-auto mt-9 flex min-h-12 w-fit items-center justify-center rounded-md border border-white/25 px-5 text-sm font-medium text-white hover:bg-white/5">Ver cronograma completo</Link>}
    <dialog ref={dialog} aria-labelledby="phase-title" className="m-auto w-[calc(100%-2.5rem)] max-w-lg rounded-lg border border-white/20 bg-[#201d2e] p-7 text-white backdrop:bg-black/70"><div className="flex items-start justify-between gap-4"><h2 id="phase-title" className="text-2xl font-semibold">{selected.title}</h2><button type="button" onClick={() => dialog.current?.close()} aria-label="Cerrar detalles de la etapa" className="flex size-11 shrink-0 items-center justify-center rounded border border-white/20"><X className="size-5" /></button></div><p className="mt-4 text-sm text-brand-pink-3">{selected.phase} · {selected.dateRange}</p><p className="mt-4 leading-relaxed text-white/75">{selected.details}</p></dialog>
  </div></section>
}
