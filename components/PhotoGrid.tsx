'use client'

import { Photo } from '@/lib/types'
import { CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface PhotoGridProps {
  photos: Photo[]
  selectedIds?: Set<string>
  onToggle?: (id: string) => void
  onOpenLightbox?: (id: string) => void
  readOnly?: boolean
}

export function PhotoGrid({ photos, selectedIds = new Set(), onToggle, onOpenLightbox, readOnly = false }: PhotoGridProps) {
  function handleClick(photo: Photo) {
    if (readOnly) {
      onOpenLightbox?.(photo.id)
      return
    }
    onToggle?.(photo.id)
  }

  function handleDoubleClick(photo: Photo) {
    if (!readOnly) {
      onOpenLightbox?.(photo.id)
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
      {photos.map((photo) => {
        const isSelected = selectedIds.has(photo.id)
        const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${photo.storage_path}`

        return (
          <div
            key={photo.id}
            onClick={() => handleClick(photo)}
            onDoubleClick={() => handleDoubleClick(photo)}
            className={cn(
              'relative aspect-square overflow-hidden rounded-lg cursor-pointer group',
              'border-2 transition-all duration-200',
              isSelected
                ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                : 'border-transparent hover:border-zinc-600',
              readOnly && 'cursor-zoom-in'
            )}
          >
            <Image
              src={url}
              alt={photo.filename}
              fill
              className={cn(
                'object-cover transition-all duration-200',
                isSelected ? 'brightness-90' : 'group-hover:brightness-75'
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            />
            {isSelected && (
              <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-0.5 shadow-lg">
                <CheckCircle className="w-4 h-4 text-white fill-white" />
              </div>
            )}
            {isSelected && (
              <div className="absolute inset-0 bg-emerald-500/10" />
            )}
          </div>
        )
      })}
    </div>
  )
}
