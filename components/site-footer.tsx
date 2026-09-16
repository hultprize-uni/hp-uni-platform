import Link from 'next/link'
import { AtSign, Share2, Shield } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { NAV_LINKS, ROUTES } from '@/lib/site-config'

const SOCIALS = [
  { label: 'Instagram', href: '{{URL_INSTAGRAM}}', icon: AtSign },
  { label: 'LinkedIn', href: '{{URL_LINKEDIN}}', icon: Share2 },
]

// Créditos por squad — visibles solo si el cliente confirma publicarlos.
const SHOW_TEAM_CREDITS = false
const SQUADS = ['Squad UI', 'Squad BD & Analytics', 'Squad Fullstack', 'Squad Auth & Sec']

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-brand-ink">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <BrandLogo />
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              La competencia global de emprendimiento social, alojada por la
              Universidad Nacional de Ingeniería. Ingeniería y ciencia
              resolviendo retos del mundo real.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-brand-pink/50 hover:text-brand-pink-3"
                >
                  <social.icon className="size-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <nav aria-label="Secciones">
              <h3 className="text-sm font-semibold text-white">Explora</h3>
              <ul className="mt-4 space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Participar">
              <h3 className="text-sm font-semibold text-white">Participar</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href={ROUTES.registro}
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    Inscribir Equipo
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.matchmaking}
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    Buscar Squad
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.portalEntregables}
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    Portal de Entregables
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label="Accesos">
              <h3 className="text-sm font-semibold text-white">Accesos</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href={ROUTES.login}
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.accesoJurado}
                    className="inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-brand-cyan"
                  >
                    <Shield className="size-3.5" aria-hidden="true" />
                    Acceso Jurado
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.accesoAdmin}
                    className="inline-flex items-center gap-1.5 text-sm text-white/55 transition-colors hover:text-brand-cyan"
                  >
                    <Shield className="size-3.5" aria-hidden="true" />
                    Acceso Admin
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {SHOW_TEAM_CREDITS ? (
          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="text-xs uppercase tracking-wide text-white/40">
              Construido por
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {SQUADS.map((squad) => (
                <li key={squad} className="text-sm text-white/55">
                  {squad}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Hult Prize at UNI. Iniciativa
            estudiantil de la Universidad Nacional de Ingeniería.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="{{URL_PRIVACIDAD}}"
              className="transition-colors hover:text-white"
            >
              Aviso de privacidad
            </Link>
            <span aria-hidden="true">·</span>
            <span>Hecho con rigor UNICode</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
