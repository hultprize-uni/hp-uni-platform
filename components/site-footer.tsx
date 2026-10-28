import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { NAV_LINKS } from '@/lib/site-config'
import { REGISTRATION_URL } from '@/lib/public-content'

export function SiteFooter() {
  return <footer className="border-t border-white/10 bg-brand-ink">
    <section aria-labelledby="closing-title" className="bg-brand-pink px-5 py-12 text-brand-ink sm:px-8 sm:py-16"><div className="mx-auto flex max-w-7xl flex-col items-center gap-8 text-center"><h2 id="closing-title" className="w-full text-pretty text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">¿Te animas a cambiar el mundo desde la UNI?<br className="hidden sm:block" /> Postula tu idea hoy.</h2><Link href={REGISTRATION_URL} className="inline-flex min-h-16 w-full max-w-sm items-center justify-center gap-4 rounded-md bg-brand-ink px-10 py-4 text-lg font-bold text-white transition-colors hover:bg-brand-ink/85">Inscríbete aquí<ArrowRight className="size-6" aria-hidden="true" /></Link></div></section>
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
    <div className="flex flex-col justify-between gap-7 pt-8 md:flex-row md:items-start"><div><Link href="/#inicio" aria-label="Hult Prize at UNI, volver al inicio"><Image src="/logos/ef-hult-uni-degradado.png" alt="EF Hult Prize at UNI, identidad actualizada" width={381} height={258} className="h-28 w-auto object-contain object-left sm:h-32" /></Link><p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">Competencia universitaria de emprendimiento de impacto. Iniciativa estudiantil de la Universidad Nacional de Ingeniería.</p></div><nav aria-label="Secciones del sitio"><ul className="flex max-w-lg flex-wrap gap-x-6 gap-y-1">{NAV_LINKS.map(link => <li key={link.href}><Link className="inline-flex min-h-11 items-center text-sm text-white/65 hover:text-white" href={link.href}>{link.label}</Link></li>)}<li><Link href="/#contacto" className="inline-flex min-h-11 items-center text-sm text-white/65 hover:text-white">Contacto</Link></li></ul></nav></div>
    <p className="mt-7 border-t border-white/10 pt-5 text-xs text-white/50">© {new Date().getFullYear()} Hult Prize at UNI.</p>
  </div></footer>
}
