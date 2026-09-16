'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, LogIn, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { BrandLogo } from '@/components/brand-logo'
import { NAV_LINKS, ROUTES } from '@/lib/site-config'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled
          ? 'border-b border-white/10 bg-brand-ink/85 backdrop-blur-md'
          : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="#inicio" aria-label="Hult Prize at UNI 2026 — Inicio">
          <BrandLogo />
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
            render={<Link href={ROUTES.login} />}
            nativeButton={false}
            variant="ghost"
            className="text-white/80 hover:bg-white/10 hover:text-white"
          >
            <LogIn className="size-4" aria-hidden="true" />
            Iniciar Sesión
          </Button>
          <Button
            render={<Link href={ROUTES.registro} />}
            nativeButton={false}
            className="bg-brand-pink text-white hover:bg-brand-pink-2"
          >
            Inscribir Equipo
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
                  <BrandLogo />
                </SheetTitle>
              </SheetHeader>
              <nav aria-label="Navegación móvil" className="mt-2 px-4">
                <ul className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <SheetClose
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
                    <SheetClose render={<Link href={ROUTES.registro} />} />
                  }
                  nativeButton={false}
                  className="w-full bg-brand-pink text-white hover:bg-brand-pink-2"
                >
                  Inscribir Equipo
                </Button>
                <Button
                  render={<SheetClose render={<Link href={ROUTES.login} />} />}
                  nativeButton={false}
                  variant="outline"
                  className="w-full border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  <LogIn className="size-4" aria-hidden="true" />
                  Iniciar Sesión
                </Button>
                <SheetClose
                  render={
                    <Link
                      href={ROUTES.accesoJurado}
                      className="flex items-center justify-center gap-2 rounded-md py-2 text-sm text-white/60 transition-colors hover:text-brand-cyan"
                    />
                  }
                >
                  <Shield className="size-4" aria-hidden="true" />
                  Acceso Jurado / Admin
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
