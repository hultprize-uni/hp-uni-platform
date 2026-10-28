import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
const STEPS = [
  { title: 'Elige un problema', body: 'Empieza por algo que te importe.' },
  { title: 'Suma otras miradas', body: 'Conecta ideas y habilidades distintas.' },
  { title: 'Prueba tu solución', body: 'Aprende, ajusta y vuelve a intentarlo.' },
]
export function AboutSection() {
  return <section id="about" className="about-spotlight relative overflow-hidden py-12 sm:py-16"><div className="relative mx-auto grid max-w-7xl items-center gap-9 px-5 sm:px-8 lg:grid-cols-2 lg:gap-14">
    <figure className="relative"><div aria-hidden="true" className="absolute -inset-2 rounded-lg border border-brand-pink/25 sm:-inset-3"/><div className="photo-reveal relative aspect-[4/3] overflow-hidden rounded-md border border-white/15"><Image src="/fotos/proyecto-3.webp" alt="Una participante presenta su propuesta ante el público en un evento de la UNI" fill sizes="(max-width: 1023px) 90vw, 50vw" className="object-cover"/><div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-ink/85 via-transparent to-transparent"/><figcaption className="absolute inset-x-0 bottom-0 p-5 text-xl font-semibold text-white sm:p-7">Ideas en voz alta<span className="text-brand-pink">.</span></figcaption></div></figure>
    <div><h2 className="text-center text-pretty text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">De una idea a <span className="text-brand-pink">algo real.</span></h2><p className="mt-4 text-center leading-relaxed text-white/75">Una competencia de emprendimiento para resolver desafíos sociales y ambientales desde la universidad.</p><ol className="about-steps relative mt-6 space-y-2">{STEPS.map(step => <li key={step.title} className="interactive-card relative rounded-md border border-transparent bg-white/[0.025] py-3 pl-8 pr-4"><span aria-hidden="true" className="absolute left-3 top-5 size-2 rounded-full bg-brand-pink"/><h3 className="font-semibold text-white">{step.title}</h3><p className="mt-1 text-sm text-white/65">{step.body}</p></li>)}</ol><div className="mt-5 text-center"><Link href="/cronograma" className="inline-flex min-h-12 items-center gap-3 rounded-md border border-brand-pink/35 px-5 text-sm font-semibold text-brand-pink-3 transition-colors hover:border-brand-pink hover:bg-brand-pink/10 hover:text-white">Conoce cómo es el recorrido<ArrowUpRight aria-hidden="true" className="size-4" /></Link></div></div>
  </div></section>
}
