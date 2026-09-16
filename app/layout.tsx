import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hult Prize at UNI 2026 — Ingeniería que resuelve el mundo',
  description:
    'La competencia global de emprendimiento social llega a la Universidad Nacional de Ingeniería. Inscribe tu equipo (1-4 integrantes), encuentra tu squad y construye soluciones de impacto con el sello UNICode.',
  generator: 'v0.app',
  keywords: [
    'Hult Prize',
    'UNI',
    'Universidad Nacional de Ingeniería',
    'emprendimiento social',
    'UNICode',
    '2026',
  ],
  openGraph: {
    title: 'Hult Prize at UNI 2026',
    description:
      'Ingeniería y ciencia de la UNI resolviendo retos globales. Inscribe tu equipo.',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#191919',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`dark ${spaceGrotesk.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
