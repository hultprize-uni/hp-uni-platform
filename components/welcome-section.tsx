import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { REGISTRATION_URL } from '@/lib/public-content'
const POINTS = [
  { title: 'Tengo una idea', href: REGISTRATION_URL, photo: 'proyecto-3', alt: 'Una participante presenta su propuesta' },
  { title: 'Busco equipo', href: '/#matchmaking', photo: 'DSC05426', alt: 'Participantes reunidos en un evento de la UNI' },
  { title: 'Quiero aprender', href: '/cronograma#bootcamp', photo: 'DSC05379', alt: 'Estudiantes atentos a una presentación' },
]
export function WelcomeSection() {
  return <section aria-labelledby="welcome-title" className="border-y border-white/10 bg-brand-ink py-7"><div className="mx-auto max-w-7xl px-5 sm:px-8"><h2 id="welcome-title" className="text-xl font-semibold text-white">¿Por dónde empiezas?</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{POINTS.map(point => <Link key={point.title} href={point.href} className="photo-card group relative aspect-[16/9] overflow-hidden rounded-md border border-white/15"><Image src={`/fotos/${point.photo}.webp`} alt={point.alt} fill sizes="(max-width: 767px) 90vw, 33vw" className="object-cover"/><div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"/><div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5"><h3 className="text-xl font-semibold text-white">{point.title}</h3><ArrowUpRight aria-hidden="true" className="card-arrow size-6 text-brand-pink-3"/></div></Link>)}</div></div></section>
}
