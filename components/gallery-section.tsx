import Image from 'next/image'
import { SectionHeading } from '@/components/section-heading'

const EDITIONS = [
  { src: '/fotos/proyecto-1.webp', alt: 'Un participante presenta una propuesta ante el público', title: 'Compartir' },
  { src: '/fotos/proyecto-2.webp', alt: 'Un expositor comparte sus ideas ante el público en la UNI', title: 'Aprender' },
  { src: '/fotos/proyecto-3.webp', alt: 'Una participante presenta su propuesta frente al público', title: 'Proponer' },
  { src: '/fotos/proyecto-4.webp', alt: 'Estudiantes compartiendo sus proyectos', title: 'Conectar' },
]

export function GallerySection() {
  return <section id="galeria" className="bg-[#201d2e] py-12 sm:py-16"><div className="mx-auto max-w-7xl px-5 sm:px-8">
    <SectionHeading title="Así se vive en la UNI." description="Ideas, encuentros y personas reales." />
    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[240px_240px]">{EDITIONS.map((edition,index) => <figure key={edition.src} className={`photo-reveal photo-card group relative min-h-60 overflow-hidden rounded-md border border-white/10 bg-brand-ink ${index === 0 ? 'lg:row-span-2' : index === 3 ? 'lg:col-span-2' : ''}`}>
      <Image src={edition.src} alt={edition.alt} fill sizes={index === 3 ? '(max-width: 639px) 95vw, (max-width: 1023px) 45vw, 66vw' : '(max-width: 639px) 95vw, (max-width: 1023px) 45vw, 33vw'} className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-transparent to-transparent" /><figcaption className="absolute inset-x-0 bottom-0 p-6 text-lg font-semibold text-white">{edition.title}</figcaption>
    </figure>)}</div>
  </div></section>
}
