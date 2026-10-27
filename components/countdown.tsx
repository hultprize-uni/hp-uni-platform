'use client';

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
    if (!Number.isFinite(target)) return
    const update = () => setTime(diff(target))
    const initialUpdateId = window.setTimeout(update, 0)
    const intervalId = window.setInterval(update, 1000)
    return () => {
      window.clearTimeout(initialUpdateId)
      window.clearInterval(intervalId)
    }
  }, [target])

  if (!Number.isFinite(target)) return null

  return (
    <div
      className="flex items-stretch gap-2 sm:gap-3"
      role="timer"
      aria-live="off"
      aria-label="Cuenta regresiva para el cierre de inscripciones"
    >
      {UNITS.map((unit) => (
        <div
          key={unit.key}
          className="flex min-w-[3.5rem] flex-col items-center rounded-md border border-white/15 bg-white/5 px-2 py-2.5 sm:min-w-[4.5rem] sm:px-3"
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
