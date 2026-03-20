'use client'

import { Gallery, Photo } from '@/lib/types'
import { PhotoGrid } from '@/components/PhotoGrid'
import { PhotoLightbox } from '@/components/PhotoLightbox'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Props {
  gallery: Gallery
  photos: Photo[]
}

export function GalleryDetailClient({ gallery, photos }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const selectedPhotos = photos.filter((p) => p.selected)
  const clientUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/gallery/${gallery.token}`

  function copyLink() {
    navigator.clipboard.writeText(clientUrl)
    toast.success('Link copied!')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm truncate">
          {clientUrl}
        </div>
        <Button variant="outline" size="sm" onClick={copyLink} className="border-zinc-700 text-zinc-300">
          <Copy className="w-4 h-4 mr-2" />Copy Link
        </Button>
        <Link href={`/gallery/${gallery.token}`} target="_blank">
          <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {gallery.client_note && (
        <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
          <p className="text-xs text-zinc-400 font-medium mb-1">Client Note</p>
          <p className="text-zinc-300 italic">"{gallery.client_note}"</p>
        </div>
      )}

      {gallery.status !== 'pending' && selectedPhotos.length > 0 && (
        <div className="p-4 rounded-lg bg-emerald-950 border border-emerald-900">
          <p className="text-emerald-300 font-medium mb-1">
            Client selected {selectedPhotos.length} photo{selectedPhotos.length !== 1 ? 's' : ''}
          </p>
          <p className="text-emerald-400/70 text-sm">Approved {gallery.approved_at ? new Date(gallery.approved_at).toLocaleDateString() : ''}</p>
        </div>
      )}

      {gallery.status === 'pending' && (
        <div className="p-4 rounded-lg bg-amber-950 border border-amber-900">
          <p className="text-amber-300 font-medium">Awaiting client approval</p>
          <p className="text-amber-400/70 text-sm mt-0.5">Share the link above with your client so they can select their favorites.</p>
        </div>
      )}

      <div>
        <h2 className="text-zinc-300 font-medium mb-3">{photos.length} Photo{photos.length !== 1 ? 's' : ''}</h2>
        <PhotoGrid
          photos={photos}
          selectedIds={new Set(selectedPhotos.map((p) => p.id))}
          readOnly
          onOpenLightbox={(id) => {
            const idx = photos.findIndex((p) => p.id === id)
            if (idx !== -1) setLightboxIndex(idx)
          }}
        />
      </div>

      <PhotoLightbox
        photos={photos}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
        selectedIds={new Set(selectedPhotos.map((p) => p.id))}
        readOnly
      />
    </div>
  )
}
