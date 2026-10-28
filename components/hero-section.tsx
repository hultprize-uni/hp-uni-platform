'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Countdown } from '@/components/countdown'
import { REGISTRATION_CLOSE_ISO, REGISTRATION_CLOSE_LABEL } from '@/lib/site-config'
import { REGISTRATION_URL } from '@/lib/public-content'

const HERO_IMAGES = [
  { src: '/fotos/hero-3.webp', alt: 'Participantes de un evento en la UNI saludan juntos frente al escenario', caption: 'Aquí empieza tu equipo.' },
  { src: '/fotos/proyecto-3.webp', alt: 'Una participante comparte su propuesta ante el público', caption: 'Tu idea merece escucharse.' },
  { src: '/fotos/hero-2.webp', alt: 'Participantes comparten un momento de celebración con música en la UNI', caption: 'Ideas que nos reúnen.' },
  { src: '/fotos/hero-1.webp', alt: 'La comunidad reunida frente al escenario de la UNI', caption: 'Una comunidad. Muchas posibilidades.' },
]

export function HeroSection() {
  const [activeImage, setActiveImage] = useState(0)
  return <section id="inicio" className="relative overflow-hidden bg-brand-ink pb-8 pt-24 sm:pb-10 sm:pt-24">
      <div aria-hidden="true" className="hero-campus"><Image src="/campus/uni-edificio-principal.png" alt="" fill sizes="(max-width: 1023px) 100vw, 85vw" className="hero-campus-photo" /></div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 80%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brand-pink/25 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-0 h-80 w-80 rounded-full bg-brand-cyan/20 blur-[120px]"
      />

    <div className="relative mx-auto max-w-7xl px-5 sm:px-8"><div className="grid items-center gap-7 lg:grid-cols-2 lg:gap-10">
      <div><h1 className="w-full text-center text-pretty text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl xl:text-6xl">Tu idea. Tu equipo. <span className="inline-block text-brand-pink">Tu impacto.</span></h1>
        <p className="mx-auto mt-5 max-w-xl text-center text-pretty text-base leading-relaxed text-white/75 sm:text-lg">Emprende desde la UNI. Encuentra equipo y transforma una idea en impacto.</p>
        <div className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap"><Button render={<Link href={REGISTRATION_URL} />} nativeButton={false} size="lg" className="min-h-16 w-full sm:w-auto sm:min-w-60 bg-brand-pink px-9 text-lg font-semibold text-brand-ink hover:bg-brand-pink-2">Quiero participar<ArrowRight className="size-5" aria-hidden="true" /></Button><Button render={<Link href="/#matchmaking" />} nativeButton={false} size="lg" variant="outline" className="min-h-16 w-full sm:w-auto sm:min-w-60 border-white/25 bg-transparent px-9 text-lg text-white hover:bg-white/10"><Users className="size-5" aria-hidden="true" />Busco equipo</Button></div>
        {REGISTRATION_CLOSE_ISO && <div className="mt-6 border-t border-white/15 pt-5"><p className="text-sm font-semibold text-brand-pink-3">Cierre de inscripciones</p><p className="mt-1 text-sm text-white/80">{REGISTRATION_CLOSE_LABEL} · hora de Perú</p><div className="mt-3"><Countdown targetIso={REGISTRATION_CLOSE_ISO} /></div></div>}
      </div>
      <div role="region" aria-roledescription="carrusel" aria-label="Imágenes de la comunidad Hult Prize at UNI" className="relative isolate aspect-[4/3] overflow-hidden rounded-lg border border-white/15 bg-[#201d2e] lg:aspect-[4/3]">
        {HERO_IMAGES.map((image, index) => <Image key={image.src} src={image.src} alt={image.alt} fill aria-hidden={activeImage !== index} priority={index === 0} sizes="(max-width: 1023px) 95vw, 50vw" className={`hero-slide object-cover ${activeImage === index ? 'is-active z-10 opacity-100' : 'z-0 opacity-0'}`} />)}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-brand-ink/90 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-30 p-4 sm:p-5"><p className="mb-3 max-w-sm text-base font-medium leading-relaxed text-white sm:text-lg">{HERO_IMAGES[activeImage].caption}</p><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-1">{HERO_IMAGES.map((image,index) => <button key={image.src} type="button" aria-label={`Mostrar imagen ${index + 1} de ${HERO_IMAGES.length}`} aria-pressed={activeImage === index} onClick={() => setActiveImage(index)} className="flex size-11 items-center justify-center rounded-md hover:bg-white/10"><span aria-hidden="true" className={`h-1.5 w-7 rounded-full ${activeImage === index ? 'bg-brand-pink' : 'bg-white/50'}`} /></button>)}</div></div></div>
      </div>
    </div>
    </div>
    <div className="relative mx-auto mt-7 flex max-w-7xl flex-wrap items-center justify-between gap-5 border-t border-white/15 px-5 pt-5 sm:px-8"><div aria-label="Hult Prize at UNI" className="hult-signature"><span>Hult Prize<span className="text-brand-pink"> at UNI</span></span><span className="text-xs font-normal tracking-[.18em] text-white/55">IDEAS QUE CONECTAN</span></div><Image src="/logos/ef-hult-uni-monocromo.png" alt="EF Hult Prize at UNI, identidad actualizada" width={387} height={261} className="h-20 w-auto max-w-[42%] object-contain sm:h-28" /></div>
  </section>
}
