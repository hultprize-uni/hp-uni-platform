'use client'

import { useEffect, useState } from 'react'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function diff(target: number): TimeLeft {
  const total = Math.max(0, target - Date.now())
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  }
}

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: 'days', label: 'Días' },
  { key: 'hours', label: 'Horas' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Seg' },
]

export function Countdown({ targetIso }: { targetIso: string }) {
  const target = new Date(targetIso).getTime()
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTime(diff(target))
    const id = setInterval(() => setTime(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <div
      className="flex items-stretch gap-2 sm:gap-3"
      role="timer"
      aria-label="Cuenta regresiva para el cierre de inscripciones"
    >
      {UNITS.map((unit) => (
        <div
          key={unit.key}
          className="flex min-w-[4.25rem] flex-col items-center rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm sm:min-w-[5rem]"
        >
          <span className="font-mono text-2xl font-bold tabular-nums text-white sm:text-3xl">
            {time ? String(time[unit.key]).padStart(2, '0') : '--'}
          </span>
          <span className="mt-1 text-[0.65rem] font-medium uppercase tracking-widest text-brand-pink-3">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  )
}
