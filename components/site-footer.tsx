import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { NAV_LINKS } from '@/lib/site-config'
import { REGISTRATION_URL } from '@/lib/public-content'

export function SiteFooter() {
  return <footer className="border-t border-white/10 bg-brand-ink"><div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
    <div className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><h2 className="max-w-3xl text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">Tu idea merece un primer paso.</h2><p className="mt-4 max-w-xl text-base leading-relaxed text-white/65">Trae tu idea. Hagamos que avance.</p></div><Link href={REGISTRATION_URL} className="inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-md bg-brand-pink px-6 py-3 font-semibold text-brand-ink hover:bg-brand-pink-2">Quiero participar<ArrowRight className="size-5" aria-hidden="true" /></Link></div>
    <div className="flex flex-col justify-between gap-7 pt-8 md:flex-row md:items-start"><div><Link href="/#inicio" aria-label="Hult Prize at UNI, volver al inicio"><Image src="/logos/Diseño sin título (1).jpg" alt="Hult Prize y Universidad Nacional de Ingeniería" width={465} height={170} className="h-12 w-auto object-contain object-left" /></Link><p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">Competencia universitaria de emprendimiento de impacto. Iniciativa estudiantil de la Universidad Nacional de Ingeniería.</p></div><nav aria-label="Secciones del sitio"><ul className="flex max-w-lg flex-wrap gap-x-6 gap-y-1">{NAV_LINKS.map(link => <li key={link.href}><Link className="inline-flex min-h-11 items-center text-sm text-white/65 hover:text-white" href={link.href}>{link.label}</Link></li>)}<li><Link href="/#contacto" className="inline-flex min-h-11 items-center text-sm text-white/65 hover:text-white">Contacto</Link></li></ul></nav></div>
    <p className="mt-7 border-t border-white/10 pt-5 text-xs text-white/50">© {new Date().getFullYear()} Hult Prize at UNI.</p>
  </div></footer>
}
