import Link from 'next/link'
import Image from 'next/image'
import { NAV_LINKS, ROUTES } from '@/lib/site-config'

// Créditos por squad — visibles solo si el cliente confirma publicarlos.
const SHOW_TEAM_CREDITS = false
const SQUADS = ['Squad UI', 'Squad BD & Analytics', 'Squad Fullstack', 'Squad Auth & Sec']
const INTERNAL_LOGOS = [
  { src: '/logos/Diseño sin título (3).jpg', alt: 'Hult Prize y Universidad Nacional de Ingeniería', box: 'bg-brand-ink' },
  { src: '/logos/Diseño sin título (6).jpg', alt: 'Isotipo Hult Prize', box: 'bg-brand-ink' },
  { src: '/logos/Diseño sin título (7).jpg', alt: 'Isotipo magenta Hult Prize', box: 'bg-white' },
  { src: '/logos/Diseño sin título (5).jpg', alt: 'Logotipo Hult Prize en versión invertida', box: 'bg-brand-ink', invert: true },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-brand-ink">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            <Image
              src="/logos/Diseño sin título (1).jpg"
              alt="Hult Prize y Universidad Nacional de Ingeniería"
              width={465}
              height={170}
              className="h-16 w-auto object-contain object-left"
              loading="lazy"
            />
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Competencia universitaria de emprendimiento de impacto. Una
              iniciativa de la Universidad Nacional de Ingeniería.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
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
              </ul>
            </nav>
          </div>
        </div>

        <div
          role="group"
          aria-label="Logos e isotipos internos de Hult Prize"
          className="mt-10 grid grid-cols-4 gap-2 border-t border-white/10 pt-8 sm:max-w-lg sm:gap-3"
        >
          {INTERNAL_LOGOS.map((logo) => (
            <div
              key={logo.src}
              className={`flex h-16 items-center justify-center rounded-md p-2 sm:h-20 ${logo.box}`}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={100}
                height={80}
                className={`max-h-full w-auto max-w-full object-contain ${logo.invert ? 'invert' : ''}`}
                loading="lazy"
              />
            </div>
          ))}
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
            <a href="#contacto" className="transition-colors hover:text-white">
              Contacto
            </a>
            <span aria-hidden="true">·</span>
            <span>Hecho con rigor UNICode</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
