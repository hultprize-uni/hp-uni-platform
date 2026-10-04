import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/site-config'

export function ClosingCta() {
  return (
    <section className="border-t border-brand-pink/30 bg-brand-pink py-16 text-brand-ink sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-7 px-4 sm:px-8 md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-3xl text-balance text-3xl font-bold leading-tight sm:text-5xl">
          ¿Te animas a cambiar el mundo desde la UNI? Postula tu idea hoy.
        </h2>
        <Button
          render={<Link href={ROUTES.registro} />}
          nativeButton={false}
          size="lg"
          className="h-12 shrink-0 bg-brand-ink px-6 text-base text-white hover:bg-brand-ink/85"
        >
          Inscríbete aquí
          <ArrowUpRight className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </section>
  )
}