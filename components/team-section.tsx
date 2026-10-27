import Image from 'next/image'
import { ArrowUpRight, UserRound } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'
import { TEAM_PROFILES, type TeamProfile, httpsUrl } from '@/lib/public-content'
import { CONTACT_CHANNELS } from '@/lib/site-config'

function Profile({ profile }: { profile: TeamProfile }) {
  const linkedin = httpsUrl(profile.linkedin)
  return <article className="flex h-full items-start gap-5 border-t border-white/15 py-7">
    <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
      {profile.photo ? <Image src={profile.photo} alt={profile.name ?? profile.role} fill sizes="80px" className="object-cover" /> : <UserRound className="size-7 text-white/35" aria-hidden="true" />}
    </div>
    <div className="min-w-0"><p className="text-sm text-brand-pink-3">{profile.role}</p><h3 className="mt-2 text-lg font-semibold text-white">{profile.name ?? 'Perfil por confirmar'}</h3>
      {linkedin ? <a className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-white/80 hover:text-brand-cyan" href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight className="size-4" aria-hidden="true" /></a> : <p className="mt-2 text-sm text-white/50">Conocerás su perfil próximamente.</p>}
    </div>
  </article>
}

export function TeamSection() {
  const email = CONTACT_CHANNELS.email
  const profiles = TEAM_PROFILES.filter(profile => profile.name && profile.photo)
  return <section id="equipo" className="bg-[#201d2e] py-12 sm:py-16"><div className="mx-auto max-w-7xl px-5 sm:px-8">
    <SectionHeading title="Personas detrás del encuentro." description="Un equipo para acompañarte." />
    {profiles.length ? <><div className="mt-8 grid gap-x-10 md:grid-cols-2">{profiles.filter(p => p.group === 'campus').map(profile => <Profile key={profile.id} profile={profile} />)}</div><div className="grid gap-x-8 sm:grid-cols-2 xl:grid-cols-4">{profiles.filter(p => p.group === 'area').map(profile => <Profile key={profile.id} profile={profile} />)}</div></> : <div className="mt-8 grid items-center gap-6 lg:grid-cols-[1fr_0.8fr]"><figure><div className="relative aspect-[16/9] overflow-hidden rounded-md"><Image src="/fotos/hero-2.webp" alt="Participantes comparten una celebración con música en un evento de la UNI" fill sizes="(max-width: 1023px) 90vw, 55vw" className="object-cover" /></div><figcaption className="mt-3 text-sm text-white/55">Un momento compartido por la comunidad en la UNI.</figcaption></figure><div className="border-l-2 border-brand-pink/50 pl-6"><h3 className="text-2xl font-semibold leading-snug text-white">Conectar también es crear.</h3><p className="mt-4 leading-relaxed text-white/70">Ideas distintas. Un punto de encuentro.</p><p className="mt-4 text-sm leading-relaxed text-white/55">Perfiles del equipo organizador: próximamente.</p></div></div>}
    <div id="contacto" className="mt-5 border-t border-white/10 pt-7"><h3 className="text-xl font-semibold text-white">¿Tienes dudas? Estamos para acompañarte.</h3><p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65">Podrás contactar al equipo a través de sus perfiles de LinkedIn. {email ? <>También puedes escribirnos a <a className="break-all text-brand-pink-3 underline underline-offset-4" href={`mailto:${email}`}>{email}</a>.</> : 'El correo y los canales oficiales de la edición se anunciarán próximamente.'}</p></div>
  </div></section>
}
