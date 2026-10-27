import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { StagesSection } from '@/components/stages-section'
import { BootcampSection } from '@/components/bootcamp-section'
import { SiteFooter } from '@/components/site-footer'
export const metadata: Metadata = { title: 'Cronograma 2027 | Hult Prize at UNI' }
export default function SchedulePage() {
  return <><SiteHeader /><a href="#contenido" className="skip-link">Saltar al contenido</a><main id="contenido" tabIndex={-1} className="pt-28 sm:pt-32"><div className="mx-auto max-w-7xl px-5 sm:px-8"><Link href="/#inicio" className="inline-flex min-h-11 items-center text-sm text-white/65 hover:text-white">← Volver al inicio</Link><h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">Cronograma 2027.</h1><p className="mt-5 max-w-2xl leading-relaxed text-white/65">Todo el proceso en una sola vista. El calendario de la convocatoria se actualizará cuando la organización confirme sus fechas.</p></div><StagesSection detailed /><BootcampSection /></main><SiteFooter /></>
}
