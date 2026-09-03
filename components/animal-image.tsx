import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Animal } from '@/lib/types/ranking'

type AnimalImageProps = {
  animal?: Pick<Animal, 'tipo' | 'imagen'> | null
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: { box: 'size-10', px: '40px' },
  md: { box: 'size-14', px: '56px' },
  lg: { box: 'size-20', px: '80px' },
} as const

export function AnimalImage({ animal, alt, size = 'sm', className }: AnimalImageProps) {
  const dim = sizes[size]
  const label = alt ?? animal?.tipo ?? 'Blanco 3D'
  const src = animal?.imagen ?? '/placeholder.svg'

  return (
    <div className={cn('relative shrink-0 overflow-hidden rounded-lg bg-muted', dim.box, className)}>
      <Image src={src} alt={label} fill sizes={dim.px} className="object-contain p-0.5" />
    </div>
  )
}
