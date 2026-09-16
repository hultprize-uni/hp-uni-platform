import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SectionHeading } from '@/components/section-heading'
import { FAQ_ITEMS } from '@/lib/site-config'

export function FaqSection() {
  return (
    <section id="faq" className="bg-brand-navy/25 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Preguntas frecuentes"
          title="Lo que todo postulante quiere saber."
        />

        <Accordion multiple={false} className="mt-10 w-full">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border-white/10"
            >
              <AccordionTrigger className="py-5 text-left text-base font-semibold text-white hover:text-brand-pink-3 hover:no-underline aria-expanded:text-brand-pink-3">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-white/65">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
