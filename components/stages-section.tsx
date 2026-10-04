 'use client';

 import Image from 'next/image'
 import { useRef } from 'react'
 import { SectionHeading } from '@/components/section-heading'
 import { LOCAL_PHASES } from '@/lib/site-config'

 export function StagesSection() {
   const carouselRef = useRef<HTMLOListElement>(null)

   function scrollCarousel(direction: -1 | 1) {
     carouselRef.current?.scrollBy({
       left: direction * 384,
       behavior: 'smooth',
     })
   }

   return (
     <section
       id="cronograma"
       className="bg-brand-navy/25 py-20 sm:py-28"
     >
       <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionHeading
          eyebrow="Cronograma 2027"
          title="Un recorrido para llevar tu propuesta a la final."
          description="El programa avanza desde la inscripción y la formación hasta la presentación de tu propuesta. Desliza para recorrer sus cuatro etapas; las fechas se confirmarán con el calendario oficial."
        />

        <div className="mt-10 overflow-hidden">
          <div className="mb-4 flex justify-end gap-2">
            {([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                aria-label={direction < 0 ? 'Ver etapa anterior' : 'Ver etapa siguiente'}
                onClick={() => scrollCarousel(direction)}
                className="flex size-11 items-center justify-center rounded-full border border-white/15 bg-black transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink"
              >
                <Image
                  src="/logos/Diseño sin título (9).jpg"
                  alt=""
                  width={391}
                  height={117}
                  className={`h-5 w-[4.2rem] invert ${direction < 0 ? 'scale-x-[-1]' : ''}`}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
          <ol
            ref={carouselRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain scroll-smooth pb-5"
          >
            {LOCAL_PHASES.map((phase) => (
              <li
                key={phase.key}
                className="w-[min(84vw,22rem)] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:w-[22rem]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#201d2e]">
                  <Image
                    src={phase.image}
                    alt={`Ilustración de ${phase.phase}: ${phase.title}`}
                    width={880}
                    height={550}
                    loading="lazy"
                    sizes="(max-width: 640px) 84vw, 22rem"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-brand-pink px-3 py-1 text-xs font-bold text-white">
                    {phase.phase}
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-cyan">
                    {phase.dateRange}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-white">{phase.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{phase.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
