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
import { NAV_LINKS, ROUTES } from '@/lib/site-config'

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-[#191919]/80 shadow-[0_4px_20px_rgba(234,72,153,0.15)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link href="#inicio" aria-label="Hult Prize at UNI 2027 — Inicio">
          <Image
            src="/logos/Diseño sin título.jpg"
            alt="Hult Prize at UNI 2027"
            width={258}
            height={95}
            priority
            className="h-12 w-auto"
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
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            render={<Link href={ROUTES.registro} />}
            nativeButton={false}
            className="bg-gradient-to-r from-[#ea4899] to-[#8a2899] text-white hover:brightness-110"
          >
            Inscríbete aquí
          </Button>
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
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
                    src="/logos/Diseño sin título.jpg"
                    alt="Hult Prize at UNI 2027"
                    width={258}
                    height={95}
                    className="h-12 w-auto"
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
                      render={<Link href={ROUTES.registro} />}
                    />
                  }
                  nativeButton={false}
                  className="w-full bg-gradient-to-r from-[#ea4899] to-[#8a2899] text-white hover:brightness-110"
                >
                  Inscríbete aquí
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#12d8e8]/0 via-[#ea4899]/80 to-[#8a2899]/0"
      />
    </header>
  )
}
