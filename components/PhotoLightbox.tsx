'use client'

import { Photo } from '@/lib/types'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'

interface PhotoLightboxProps {
  photos: Photo[]
  currentIndex: number | null
  onClose: () => void
  onNavigate: (index: number) => void
  selectedIds?: Set<string>
  onToggle?: (id: string) => void
  readOnly?: boolean
}

export function PhotoLightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate,
  selectedIds = new Set(),
  onToggle,
  readOnly = false,
}: PhotoLightboxProps) {
  const isOpen = currentIndex !== null
  const photo = currentIndex !== null ? photos[currentIndex] : null
  const isSelected = photo ? selectedIds.has(photo.id) : false

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'ArrowLeft' && currentIndex! > 0) onNavigate(currentIndex! - 1)
      if (e.key === 'ArrowRight' && currentIndex! < photos.length - 1) onNavigate(currentIndex! + 1)
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, currentIndex, photos.length, onNavigate, onClose])

  if (!photo) return null

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${photo.storage_path}`

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl w-full bg-zinc-950 border-zinc-800 p-0 overflow-hidden">
        <div className="relative w-full" style={{ height: '80vh' }}>
          <Image
            src={url}
            alt={photo.filename}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 80vw"
            priority
          />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {currentIndex! > 0 && (
            <button
              onClick={() => onNavigate(currentIndex! - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {currentIndex! < photos.length - 1 && (
            <button
              onClick={() => onNavigate(currentIndex! + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {!readOnly && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800">
            <div>
              <p className="text-zinc-400 text-sm">{photo.filename}</p>
              <p className="text-zinc-600 text-xs">
                {currentIndex! + 1} of {photos.length}
              </p>
            </div>
            <Button
              onClick={() => onToggle?.(photo.id)}
              variant={isSelected ? 'default' : 'outline'}
              className={isSelected
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'border-zinc-700 text-zinc-300 hover:bg-zinc-800'
              }
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isSelected ? 'Selected' : 'Select as Favorite'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
