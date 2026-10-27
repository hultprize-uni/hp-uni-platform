'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Users, Pause, Play } from 'lucide-react'
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
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    if (!playing) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motion.matches) return
    const stopOnPreference = () => setPlaying(false)
    motion.addEventListener('change', stopOnPreference)
    const interval = window.setInterval(() => setActiveImage(current => (current + 1) % HERO_IMAGES.length), 5000)
    return () => { window.clearInterval(interval); motion.removeEventListener('change', stopOnPreference) }
  }, [playing])
  return <section id="inicio" className="relative overflow-hidden bg-brand-ink pb-8 pt-24 sm:pb-10 sm:pt-24">
    <div aria-hidden="true" className="hult-hero-background"><span className="hult-watermark">HULT<span>PRIZE</span></span><svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="currentColor"><path d="M-80 420 220 120h280l180 180h300l250-250M-60 465l300-300h240l180 180h340l250-250M-40 510l300-300h200l180 180h380l250-250"/><circle cx="220" cy="120" r="7"/><circle cx="680" cy="300" r="7"/><circle cx="980" cy="300" r="7"/></g></svg></div>
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8"><div className="grid items-start gap-7 lg:grid-cols-2 lg:gap-12">
      <div><h1 className="hero-title max-w-2xl text-balance text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl xl:text-6xl"><span className="title-word">Tu idea.</span>{' '}<span className="title-word">Tu equipo.</span>{' '}<span className="title-word impact-word text-brand-pink">Tu impacto.<svg aria-hidden="true" viewBox="0 0 300 16" preserveAspectRatio="none" className="impact-stroke"><path d="M3 11 Q100 0 150 8 T297 7" /></svg></span></h1>
        <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/75 sm:text-lg">Emprende desde la UNI. Encuentra equipo y transforma una idea en impacto.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Button render={<Link href={REGISTRATION_URL} />} nativeButton={false} size="lg" className="min-h-12 bg-brand-pink px-6 text-base font-semibold text-brand-ink hover:bg-brand-pink-2">Quiero participar<ArrowRight className="size-5" aria-hidden="true" /></Button><Button render={<Link href="/#matchmaking" />} nativeButton={false} size="lg" variant="outline" className="min-h-12 border-white/25 bg-transparent px-6 text-base text-white hover:bg-white/10"><Users className="size-5" aria-hidden="true" />Busco equipo</Button></div>
        {REGISTRATION_CLOSE_ISO && <div className="mt-6 border-t border-white/15 pt-5"><p className="text-sm font-semibold text-brand-pink-3">Cierre de inscripciones</p><p className="mt-1 text-sm text-white/80">{REGISTRATION_CLOSE_LABEL} · hora de Perú</p><div className="mt-3"><Countdown targetIso={REGISTRATION_CLOSE_ISO} /></div></div>}
      </div>
      <div role="region" aria-roledescription="carrusel" aria-label="Imágenes de la comunidad Hult Prize at UNI" className="relative isolate aspect-[4/3] overflow-hidden rounded-lg border border-white/15 bg-[#201d2e] lg:aspect-[1/1]" onMouseEnter={() => setPlaying(false)} onFocusCapture={() => setPlaying(false)}>
        {HERO_IMAGES.map((image, index) => <Image key={image.src} src={image.src} alt={image.alt} fill aria-hidden={activeImage !== index} priority={index === 0} sizes="(max-width: 1023px) 95vw, 50vw" className={`hero-slide object-cover ${activeImage === index ? 'is-active z-10 opacity-100' : 'z-0 opacity-0'}`} />)}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-brand-ink/90 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-30 p-4 sm:p-5"><p className="mb-3 max-w-sm text-base font-medium leading-relaxed text-white sm:text-lg">{HERO_IMAGES[activeImage].caption}</p><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-1">{HERO_IMAGES.map((image,index) => <button key={image.src} type="button" aria-label={`Mostrar imagen ${index + 1} de ${HERO_IMAGES.length}`} aria-pressed={activeImage === index} onClick={() => { setActiveImage(index); setPlaying(false) }} className="flex size-11 items-center justify-center rounded-md hover:bg-white/10"><span aria-hidden="true" className={`h-1.5 w-7 rounded-full ${activeImage === index ? 'bg-brand-pink' : 'bg-white/50'}`} /></button>)}</div><button type="button" onClick={() => setPlaying(current => !current)} aria-label={playing ? 'Pausar imágenes' : 'Reproducir imágenes'} aria-pressed={playing} className="flex size-11 shrink-0 items-center justify-center rounded-md border border-white/30 bg-brand-ink/70 text-white">{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}</button></div></div>
      </div>
    </div>
    </div>
    <div className="relative mx-auto mt-7 flex max-w-7xl flex-wrap items-center justify-between gap-5 border-t border-white/15 px-5 pt-5 sm:px-8"><div aria-label="Hult Prize at UNI" className="hult-signature"><span>Hult Prize<span className="text-brand-pink"> at UNI</span></span><span className="text-xs font-normal tracking-[.18em] text-white/55">IDEAS QUE CONECTAN</span></div><Image src="/logos/Diseño sin título (1).jpg" alt="Hult Prize y Universidad Nacional de Ingeniería" width={465} height={170} className="h-12 w-auto max-w-[45%] object-contain sm:h-14" /></div>
  </section>
}
