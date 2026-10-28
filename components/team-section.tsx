import Image from 'next/image'
import { ArrowUpRight, UserRound } from 'lucide-react'
import { TEAM_PROFILES, type TeamProfile, httpsUrl } from '@/lib/public-content'
import { CONTACT_CHANNELS } from '@/lib/site-config'

function Profile({ profile }: { profile: TeamProfile }) {
  const linkedin = httpsUrl(profile.linkedin)
  const content = <><div className="team-portrait relative mx-auto size-44 overflow-hidden rounded-full border-[3px] border-brand-pink bg-brand-ink sm:size-48">{profile.photo ? <Image src={profile.photo} alt={profile.name ?? profile.role} fill sizes="384px" className="object-cover origin-[50%_20%] scale-[1.8] transition-transform duration-500 group-hover:scale-[1.9] motion-reduce:transition-none" /> : <UserRound className="m-auto size-20 text-white/35" aria-hidden="true" />}</div><h3 className="mt-6 bg-white px-5 py-2 text-xl font-bold leading-tight text-[#b50061] sm:text-2xl">{profile.name}</h3><p className="mt-3 flex items-center justify-center gap-2 text-base font-medium text-white/90">{profile.role}{linkedin && <ArrowUpRight aria-hidden="true" className="size-4 text-brand-pink-3" />}</p><span className="mt-2 inline-block text-xs text-white/60">Hult Prize at UNI</span></>
  return <article className="w-full max-w-xs text-center">{linkedin ? <a className="group block rounded-sm focus-visible:outline-brand-pink" href={linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${profile.name}, ${profile.role}. Ver LinkedIn (abre en una pestaña nueva)`}>{content}</a> : content}</article>
}

export function TeamSection() {
  const email = CONTACT_CHANNELS.email
  const profiles = TEAM_PROFILES.filter(profile => profile.name && profile.photo)
  return <section id="equipo" className="team-showcase py-12 sm:py-16"><div className="relative mx-auto max-w-7xl px-5 sm:px-8">
    <div className="py-5 text-center"><h2 className="w-full text-pretty text-3xl font-semibold tracking-tight text-brand-pink sm:text-4xl lg:text-5xl">Conoce a nuestro equipo.</h2><p className="mt-3 text-xl font-bold text-white sm:text-2xl">Las personas detrás de cada idea.</p></div>
    <div className="mt-10 flex flex-wrap justify-center gap-x-16 gap-y-10 sm:mt-12">{profiles.map(profile => <Profile key={profile.id} profile={profile} />)}</div>
    <div id="contacto" className="mt-9 border-t border-white/10 pt-7 text-center"><h3 className="text-xl font-semibold text-white">¿Tienes dudas? Estamos para acompañarte.</h3><p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/65">Podrás contactar al equipo a través de sus perfiles de LinkedIn. {email ? <>También puedes escribirnos a <a className="break-all text-brand-pink-3 underline underline-offset-4" href={`mailto:${email}`}>{email}</a>.</> : 'El correo y los canales oficiales de la edición se anunciarán próximamente.'}</p></div>
  </div></section>
}
