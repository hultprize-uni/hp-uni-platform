'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { REGISTRATION_URL } from '@/lib/public-content'
import { NAV_LINKS } from '@/lib/site-config'

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-[#191919]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link href="/#inicio" aria-label="Hult Prize at UNI 2027 — Inicio">
          <Image
            src="/logos/hp-uni-logo-principal.jpg"
            alt="Hult Prize at UNI 2027"
            width={258}
            height={95}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav aria-label="Navegación principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li><Button render={<Link href={REGISTRATION_URL} />} nativeButton={false} className="ml-3 min-h-11 bg-brand-pink px-4 font-semibold text-brand-ink hover:bg-brand-pink-2">Inscríbete</Button></li>
          </ul>
        </nav>

        {/* Mobile */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-11 text-white hover:bg-white/10"
                  aria-label="Abrir menú"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full max-w-xs border-white/10 bg-brand-ink text-white"
            >
              <SheetHeader>
                <SheetTitle className="text-left text-white">
                  <Image
                    src="/logos/hp-uni-logo-principal.jpg"
                    alt="Hult Prize at UNI 2027"
                    width={258}
                    height={95}
                    className="h-10 w-auto"
                    loading="lazy"
                  />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Navegación móvil" className="mt-2 px-4">
                <ul className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <SheetClose
                        nativeButton={false}
                        render={
                          <a
                            href={link.href}
                            className="block rounded-lg px-3 py-3 text-base font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                          />
                        }
                      >
                        {link.label}
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="mt-auto flex flex-col gap-3 p-4">
                <Button
                  render={
                    <SheetClose
                      nativeButton={false}
                      render={<Link href={REGISTRATION_URL} />}
                    />
                  }
                  nativeButton={false}
                  className="min-h-12 w-full bg-brand-pink font-semibold text-brand-ink hover:bg-brand-pink-2"
                >
                  Inscríbete aquí
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

    </header>
  )
}
