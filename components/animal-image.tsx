'use client'

import { useState } from 'react'
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
  const [isOpen, setIsOpen] = useState(false)
  const dim = sizes[size]
  const label = alt ?? 'Blanco 3D'
  const src = animal?.imagen ?? '/placeholder.svg'

  return (
    <div 
      className={cn('group relative inline-flex shrink-0 overflow-hidden rounded-full bg-muted cursor-pointer ', dim.box, className)}
      onClick={() => setIsOpen((prev) => !prev)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Image src={src} alt={label} fill sizes={dim.px} className="object-cover" />
      
      {/* Tooltip interactivo (Hover desktop / Clic mobile) */}
      <div 
        className={cn(
          "absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 translate-y-1 transition-all duration-150 ease-out pointer-events-none",
          isOpen ? "translate-y-0 opacity-100" : "opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
        )}
      >
        <div className="whitespace-nowrap rounded-md bg-popover px-2.5 py-1 text-xs font-medium text-popover-foreground shadow-md border border-border capitalize">
          Hekki
        </div>
      </div>
    </div>
  )
}