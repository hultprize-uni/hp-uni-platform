'use client'

import Image from 'next/image'
import { useState } from 'react'
import { SectionHeading } from '@/components/section-heading'

const EDITIONS = [
  { src: '/fotos/proyecto-1.webp', alt: 'Equipo universitario trabajando en un proyecto de impacto', title: 'Ideas que se convierten en acción', number: '01' },
  { src: '/fotos/proyecto-2.webp', alt: 'Participantes colaborando en una iniciativa innovadora', title: 'Equipos que crean en comunidad', number: '02' },
  { src: '/fotos/proyecto-3.webp', alt: 'Presentación de una propuesta de emprendimiento', title: 'Propuestas con impacto real', number: '03' },
  { src: '/fotos/proyecto-4.webp', alt: 'Estudiantes compartiendo sus proyectos', title: 'Talento que transforma', number: '04' },
]

export function GallerySection() {
  const [unavailableImages, setUnavailableImages] = useState<string[]>([])

  function markUnavailable(src: string) {
    setUnavailableImages((current) => current.includes(src) ? current : [...current, src])
  }

  return (
    <section id="galeria" className="overflow-hidden bg-[#201d2e] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="Archivo Hult Prize at UNI"
          title="Ideas, equipos y proyectos de impacto."
          description="Una comunidad que convierte ideas en proyectos sostenibles para responder a los desafíos globales."
        />
        <div className="relative mt-12 overflow-hidden">
          <div className="animate-marquee-right flex w-max hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="flex gap-4 pr-4">
                {EDITIONS.map((edition) => (
                  <figure
                    key={edition.src}
                    className="group relative aspect-[4/3] w-[min(78vw,20rem)] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-brand-ink sm:w-80"
                  >
                    {unavailableImages.includes(edition.src) ? (
                      <div className="absolute inset-0 flex flex-col justify-between bg-[linear-gradient(135deg,#292563_0%,#191919_55%,#8a2899_150%)] p-5">
                        <span className="font-mono text-sm text-brand-cyan">HP · UNI</span>
                        <p className="max-w-[12rem] text-xl font-semibold text-white">{edition.title}</p>
                      </div>
                    ) : (
                      <Image
                        src={edition.src}
                        alt={copy === 1 ? '' : edition.alt}
                        width={800}
                        height={600}
                        loading="lazy"
                        sizes="(max-width: 640px) 78vw, 20rem"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        onError={() => markUnavailable(edition.src)}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-transparent to-transparent" />
                    <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                      <span className="text-base font-semibold text-white">{edition.title}</span>
                      <span className="font-mono text-xs text-white/70">{edition.number}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}