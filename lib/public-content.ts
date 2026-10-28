/** Publish only identities and links validated by the organization. */
export type TeamProfile = { id: string; group: 'campus' | 'area'; role: string; name: string | null; photo: string | null; linkedin: string | null }
// Proposed 2 + 4 layout. Names and final number await confirmation.
export const TEAM_PROFILES: TeamProfile[] = [
  { id: 'diego-pinedo', group: 'area', role: 'Director de TI', name: 'Diego Pinedo', photo: '/equipo/diego-pinedo.png', linkedin: 'https://www.linkedin.com/in/diego-alonso-pinedo-aponte-998ab1351/' },
  { id: 'campus-1', group: 'campus', role: 'Dirección de campus', name: null, photo: null, linkedin: null },
  { id: 'campus-2', group: 'campus', role: 'Dirección de campus', name: null, photo: null, linkedin: null },
  ...Array.from({ length: 4 }, (_, i): TeamProfile => ({ id: `area-${i + 1}`, group: 'area', role: 'Dirección de área', name: null, photo: null, linkedin: null })),
]
export type Partner = { id: string; kind: 'community' | 'sponsor'; name: string; logo: string; url?: string }
// logo must point to an approved local /public asset.
export const PARTNERS: Partner[] = []
export function httpsUrl(value: string | null | undefined, hostname?: string): string | null {
  if (!value) return null
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && (!hostname || url.hostname === hostname) ? url.href : null } catch { return null }
}
export const WHATSAPP_GROUP_URL = httpsUrl(process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL, 'chat.whatsapp.com')
export const REGISTRATION_URL = httpsUrl(process.env.NEXT_PUBLIC_REGISTRATION_URL) ?? '/registro'
