import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hult Prize at UNI 2027 — Emprendimiento de impacto',
  description:
    'Transforma tus ideas en startups de impacto global desde la Universidad Nacional de Ingeniería. Participa en Hult Prize at UNI 2027.',
  generator: 'v0.app',
  keywords: [
    'Hult Prize',
    'UNI',
    'Universidad Nacional de Ingeniería',
    'emprendimiento social',
    'UNICode',
    '2027',
  ],
  openGraph: {
    title: 'Hult Prize at UNI 2027',
    description: 'Transforma tus ideas en startups de impacto global desde la UNI.',
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
    <html lang="es" className={`dark ${spaceGrotesk.variable} scroll-smooth scroll-pt-20`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
