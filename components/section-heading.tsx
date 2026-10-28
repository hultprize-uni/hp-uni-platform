import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'w-full',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow ? (
        <p className="sr-only">
          {eyebrow}
        </p>
      ) : null}
      {/* El título de sección es el elemento tipográfico más grande y de mayor contraste */}
      <h2 className="text-pretty text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-4 max-w-3xl text-pretty text-base leading-relaxed text-white/65 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}
