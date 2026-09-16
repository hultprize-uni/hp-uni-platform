import { cn } from '@/lib/utils'

/**
 * Logo dual: monograma "H" (Hult Prize) + escudo abstracto UNI.
 * Se mantiene pequeño/mínimo por regla de marca (nunca protagonista).
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-brand-pink text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* H de Hult Prize */}
          <path d="M6 4v16M18 4v16M6 12h12" />
        </svg>
        {/* Vértice tipo escudo UNI */}
        <span className="absolute -bottom-1 -right-1 h-3 w-3 rotate-45 rounded-[3px] border border-brand-ink bg-brand-cyan" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-bold tracking-tight text-white">
          Hult Prize
        </span>
        <span className="text-[0.68rem] font-medium tracking-[0.18em] text-brand-pink-3">
          at UNI 2026
        </span>
      </span>
    </span>
  )
}
