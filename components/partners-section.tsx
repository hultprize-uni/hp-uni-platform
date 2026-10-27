'use client'
import Image from 'next/image'
import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { PARTNERS, httpsUrl } from '@/lib/public-content'

export function PartnersSection({ kind }: { kind: 'community' | 'sponsor' }) {
  const track = useRef<HTMLUListElement>(null)
  const items = PARTNERS.filter(p => p.kind === kind)
  const isCommunity = kind === 'community'
  const title = isCommunity ? 'Aliados que comparten nuestra visión.' : 'Nuestros patrocinadores.'
  function scroll(direction: number) {
    const el = track.current
    if (el) el.scrollBy({ left: direction * el.clientWidth * .8, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  if (!items.length) return null
  return <section id={isCommunity ? 'aliados' : 'patrocinadores'} aria-label={title} className="border-y border-white/10 bg-brand-ink py-10 sm:py-12"><div className="mx-auto max-w-7xl px-5 sm:px-8">
    <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
      {items.length > 1 && <div className="flex gap-2"><button type="button" className="flex size-11 items-center justify-center border border-white/20 text-white hover:border-brand-pink" aria-label="Ver aliados anteriores" onClick={() => scroll(-1)}><ArrowLeft className="size-4" /></button><button type="button" className="flex size-11 items-center justify-center border border-white/20 text-white hover:border-brand-pink" aria-label="Ver siguientes aliados" onClick={() => scroll(1)}><ArrowRight className="size-4" /></button></div>}
    </div>
    {items.length ? <ul ref={track} tabIndex={0} aria-label={isCommunity ? 'Comunidades aliadas' : 'Patrocinadores'} className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-3">{items.map(p => {
      const url = httpsUrl(p.url)
      const content = <><Image src={p.logo} alt="" width={180} height={80} sizes="180px" className="h-16 w-44 object-contain" /><span className="mt-4 block text-sm text-white/75">{p.name}</span></>
      return <li key={p.id} className="w-56 shrink-0 snap-start border border-white/10 p-5">{url ? <a href={url} target="_blank" rel="noopener noreferrer" className="block">{content}<span className="sr-only"> (abre en una pestaña nueva)</span></a> : content}</li>
    })}</ul> : <p className="mt-3 text-sm leading-relaxed text-white/60">{isCommunity ? 'Próximamente conocerás a las comunidades que se suman a esta edición.' : 'Los patrocinadores se anunciarán cuando la organización confirme su participación.'}</p>}
  </div></section>
}
