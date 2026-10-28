'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Share2 } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { WINNERS_2026 } from '@/lib/site-config'

export function WinnersSection() {
  const [missingPhotos, setMissingPhotos] = useState<string[]>([])

  function markPhotoMissing(src: string) {
    setMissingPhotos((current) => current.includes(src) ? current : [...current, src])
  }

  const publishedWinners = WINNERS_2026.filter(winner => !winner.name.toLowerCase().includes('por confirmar') && !winner.project.toLowerCase().includes('por confirmar'))
  const isExample = publishedWinners.length === 0
  const winners = isExample ? WINNERS_2026.map((winner, index) => ({
    ...winner,
    name: ['Equipo del primer puesto', 'Equipo del segundo puesto', 'Equipo del tercer puesto'][index],
    project: 'Nombre del proyecto',
    description: 'Aquí irá una frase breve sobre la solución y el impacto del proyecto.',
  })) : publishedWinners

  return (
    <section id="ganadores" className="bg-brand-ink py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="Edición 2026"
          title="Ganadores de la edición anterior."
          description={isExample ? "Vista de ejemplo · nombres, proyectos y resultados por confirmar. Las fotos muestran el formato propuesto." : "Conoce las propuestas reconocidas en la edición anterior."}
        />
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {winners.map((winner) => (
            <li key={winner.place}>
              <article className="interactive-card h-full overflow-hidden rounded-lg border border-brand-pink/25 bg-white/[0.03]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#201d2e]">
                  {missingPhotos.includes(winner.photo) ? (
                    <div className="absolute inset-0 flex items-end bg-[linear-gradient(135deg,#292563_0%,#191919_60%,#8a2899_140%)] p-5">
                      <p className="text-sm font-medium text-white/75">Fotografía oficial pendiente</p>
                    </div>
                  ) : (
                    <Image
                      src={winner.photo}
                      alt={isExample ? `Foto de referencia para la tarjeta de ${winner.place}` : `Fotografía de ${winner.name}, ${winner.place}`}
                      width={800}
                      height={600}
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="absolute inset-0 h-full w-full object-cover"
                      onError={() => markPhotoMissing(winner.photo)}
                    />
                  )}
                  <span className="absolute left-4 top-4 bg-brand-pink px-3 py-1 text-xs font-bold text-white">
                    {winner.place}
                  </span>
                </div>
                <div className="p-5 text-center">
                  <h3 className="text-xl font-semibold text-white">{winner.name}</h3>
                  <p className="mt-1 text-sm font-medium text-brand-pink-3">{winner.project}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{winner.description}</p>
                  {winner.linkedinUrl ? (
                    <a
                      href={winner.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white hover:text-brand-pink-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink"
                    >
                      <Share2 className="size-4" aria-hidden="true" />
                      Ver perfil en LinkedIn
                    </a>
                  ) : !isExample ? (
                    <p className="mt-5 text-xs text-white/45">Perfil de LinkedIn por confirmar</p>
                  ) : null}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
