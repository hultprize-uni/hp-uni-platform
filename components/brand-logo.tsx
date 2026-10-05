import Image from 'next/image'
import { cn } from '@/lib/utils'

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      src="/logos/logo-white.png"
      alt="Hult Prize at UNI 2027"
      width={465}
      height={170}
      className={cn('h-9 w-auto object-contain sm:h-10', className)}
    />
  )
}
