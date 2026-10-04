'use client';

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Countdown } from '@/components/countdown'
import {
  REGISTRATION_CLOSE_ISO,
  REGISTRATION_CLOSE_LABEL,
  ROUTES,
} from '@/lib/site-config'

const HERO_IMAGES = [
  { src: '/fotos/hero-1.webp', alt: 'Estudiantes colaborando en un proyecto de impacto' },
  { src: '/fotos/hero-2.webp', alt: 'Equipo universitario desarrollando una idea innovadora' },
  { src: '/fotos/hero-3.webp', alt: 'Presentación de un proyecto de emprendimiento' },
  { src: '/fotos/hero-4.webp', alt: 'Comunidad universitaria reunida en un evento' },
]

export function HeroSection() {
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % HERO_IMAGES.length)
    }, 3000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-brand-ink pb-20 sm:pb-28"
    >
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

      <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-12">
          <div>
            <h1 className="max-w-2xl text-balance text-2xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
              Transforma tus ideas en{' '}
              <span className="text-brand-pink">startups de impacto global</span>{' '}
              desde la UNI.
            </h1>

            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
              Participa en la competencia universitaria de emprendimiento de
              impacto. Desarrolla una propuesta sostenible para el Reto Hult Prize
              2027 desde la Universidad Nacional de Ingeniería.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                render={<Link href={ROUTES.registro} />}
                nativeButton={false}
                size="lg"
                className="h-12 bg-brand-pink px-6 text-base text-white hover:bg-brand-pink-2"
              >
                Inscríbete aquí
                <ArrowRight className="size-5" aria-hidden="true" />
              </Button>
              <Button
                render={<Link href="#matchmaking" />}
                nativeButton={false}
                size="lg"
                variant="outline"
                className="h-12 border-white/25 bg-transparent px-6 text-base text-white hover:bg-white/10"
              >
                <Users className="size-5" aria-hidden="true" />
                Matchmaking
              </Button>
            </div>
          </div>

          <div
            role="region"
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-[#201d2e] shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
            aria-label="Galería de imágenes Hult Prize at UNI"
            aria-roledescription="carrusel"
          >
            {HERO_IMAGES.map((image, index) => (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                fill
                aria-hidden={activeImage !== index}
                {...(index === 0
                  ? { priority: true }
                  : { loading: 'lazy' as const })}
                sizes="(max-width: 767px) 100vw, 50vw"
                className={`object-cover transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
                  activeImage === index
                    ? 'z-10 opacity-100'
                    : 'z-0 opacity-0'
                }`}
              />
            ))}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-ink/70 via-transparent to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
              <p className="max-w-xs text-sm font-medium text-white sm:text-base">
                Ideas que impulsan un futuro con impacto.
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <span className="mr-1 font-mono text-xs tabular-nums text-white/80">
                  {String(activeImage + 1).padStart(2, '0')} / {HERO_IMAGES.length}
                </span>
                {HERO_IMAGES.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    aria-label={`Mostrar imagen ${index + 1} de ${HERO_IMAGES.length}`}
                    aria-pressed={activeImage === index}
                    onClick={() => setActiveImage(index)}
                    className={`size-2.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-ink ${
                      activeImage === index ? 'bg-brand-pink' : 'bg-white/55'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:mt-14 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-yellow">
                Cierre de inscripciones
              </p>
              <p className="mt-2 text-base font-medium text-white sm:text-lg">
                Cierre de inscripciones:{' '}
                <span className="font-mono text-brand-pink-3">
                  {REGISTRATION_CLOSE_LABEL}
                </span>
              </p>
              <p className="mt-1 text-sm text-white/50">
                La fecha oficial se anunciará próximamente.
              </p>
            </div>
            <Countdown targetIso={REGISTRATION_CLOSE_ISO} />
          </div>
        </div>
      </div>
    </section>
  )
}
