import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const STEPS = [
  { title: 'Elige un problema', body: 'Observa un problema de tu entorno y pregúntate qué podrías hacer diferente.' },
  { title: 'Suma otras miradas', body: 'Comparte tu idea con personas de otras especialidades. No tienes que recorrer el camino a solas.' },
  { title: 'Prueba tu solución', body: 'Contrasta tu propuesta, aprende del proceso y prepara la manera de contarla.' },
]

export function AboutSection() {
  return <section id="about" className="bg-brand-ink py-12 sm:py-16"><div className="mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-8 lg:grid-cols-2 lg:gap-12">
    <figure><div className="photo-reveal relative aspect-[4/3] overflow-hidden rounded-md border border-white/10"><Image src="/fotos/proyecto-3.webp" alt="Una participante presenta su propuesta ante el público en un evento de la UNI" fill sizes="(max-width: 1023px) 90vw, 50vw" className="object-cover" /></div><figcaption className="mt-3 text-sm leading-relaxed text-white/55">Ideas en voz alta.</figcaption></figure>
    <div><h2 className="text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">De una idea a algo real.</h2><p className="mt-5 leading-relaxed text-white/75">Una competencia de emprendimiento para resolver desafíos sociales y ambientales desde la universidad.</p><ol className="mt-6 space-y-5">{STEPS.map((step,index) => <li key={step.title} className="flex gap-4"><span className="mt-1 font-mono text-sm text-brand-pink-3" aria-hidden="true">0{index + 1}</span><div><h3 className="font-semibold text-white">{step.title}</h3></div></li>)}</ol><Link href="/cronograma" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-pink-3 underline underline-offset-4">Conoce cómo es el recorrido<ArrowUpRight aria-hidden="true" className="size-4" /></Link></div>
  </div></section>
}
