import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
export const metadata: Metadata = { title: 'Inscripciones | Hult Prize at UNI' }
export default function RegistrationPage() {
  return <><SiteHeader /><a className="skip-link" href="#contenido">Saltar al contenido</a><main id="contenido" tabIndex={-1} className="mx-auto max-w-4xl px-5 pb-24 pt-36 sm:px-8"><h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">Prepárate para participar.</h1><p className="mt-6 text-lg leading-relaxed text-white/70">El formulario oficial y las bases de inscripción se publicarán cuando la organización confirme la convocatoria.</p><p className="mt-4 leading-relaxed text-white/65">Puedes conocer los requisitos, revisar las etapas del programa y encontrar personas con quienes formar equipo.</p><div className="mt-8 flex flex-wrap gap-3"><Link className="inline-flex min-h-12 items-center rounded-md bg-brand-pink px-5 font-semibold text-brand-ink" href="/cronograma">Ver cronograma</Link><Link className="inline-flex min-h-12 items-center rounded-md border border-white/25 px-5 text-white" href="/#matchmaking">Encuentra tu equipo</Link><Link className="inline-flex min-h-12 items-center px-5 text-white/75 underline underline-offset-4" href="/#requisitos">Revisar requisitos</Link></div></main><SiteFooter /></>
}
