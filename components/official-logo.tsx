'use client'

import Image from 'next/image'
import { useState } from 'react'

export function OfficialLogo() {
  const [failed, setFailed] = useState(false)

  return (
    <div className="flex h-20 w-64 items-center sm:h-24 sm:w-80" aria-label="Hult Prize at UNI 2027">
      {failed ? (
        <span className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center bg-brand-pink text-2xl font-bold text-white">H</span>
          <span>
            <span className="block text-xl font-bold text-white">Hult Prize</span>
            <span className="block text-sm font-semibold text-brand-pink">at UNI 2027</span>
          </span>
        </span>
      ) : (
        <Image
          src="/logos/Diseño sin título.jpg"
          alt="Hult Prize at UNI 2027"
          width={258}
          height={95}
          loading="lazy"
          className="max-h-full w-full object-contain object-left"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}