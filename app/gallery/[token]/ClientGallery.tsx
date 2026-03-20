'use client'

import { Gallery, Photo } from '@/lib/types'
import { PhotoGrid } from '@/components/PhotoGrid'
import { PhotoLightbox } from '@/components/PhotoLightbox'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, CheckCircle, Lock } from 'lucide-react'

interface Props {
  gallery: Gallery
  photos: Photo[]
  isLocked: boolean
}

export function ClientGallery({ gallery, photos, isLocked }: Props) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(photos.filter((p) => p.selected).map((p) => p.id))
  )
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  function togglePhoto(id: string) {
    if (isLocked) return
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  async function handleSubmit() {
    if (selectedIds.size === 0) {
      toast.error('Please select at least one favorite photo')
      return
    }
    setSubmitting(true)
    try {
      const selectRes = await fetch(`/api/gallery/${gallery.token}/select`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selected_ids: Array.from(selectedIds) }),
      })
      if (!selectRes.ok) throw new Error('Failed to save selections')

      const approveRes = await fetch(`/api/gallery/${gallery.token}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      })
      if (!approveRes.ok) throw new Error('Failed to submit approval')

      router.push(`/gallery/${gallery.token}/success`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLocked) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-950 border border-emerald-900">
          <Lock className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-emerald-300 font-medium">Selections submitted &amp; locked</p>
            <p className="text-emerald-400/70 text-sm">Your photographer has been notified and is working on your photos.</p>
          </div>
        </div>
        <PhotoGrid
          photos={photos}
          selectedIds={new Set(photos.filter((p) => p.selected).map((p) => p.id))}
          readOnly
          onOpenLightbox={(id) => {
            const idx = photos.findIndex((p) => p.id === id)
            if (idx !== -1) setLightboxIndex(idx)
          }}
        />
        <PhotoLightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          selectedIds={new Set(photos.filter((p) => p.selected).map((p) => p.id))}
          readOnly
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-white mb-2">{gallery.name}</h1>
        <p className="text-zinc-400">Browse your proofs and click to select your favorites. When you&apos;re happy with your selections, submit below.</p>
      </div>

      {selectedIds.size > 0 && (
        <div className="sticky top-4 z-10 flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-zinc-900/95 backdrop-blur border border-zinc-800 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium text-sm">{selectedIds.size} photo{selectedIds.size !== 1 ? 's' : ''} selected</span>
          </div>
          <Button onClick={handleSubmit} disabled={submitting} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
            {submitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>) : ('Submit Selections')}
          </Button>
        </div>
      )}

      <PhotoGrid
        photos={photos}
        selectedIds={selectedIds}
        onToggle={togglePhoto}
        onOpenLightbox={(id) => {
          const idx = photos.findIndex((p) => p.id === id)
          if (idx !== -1) setLightboxIndex(idx)
        }}
      />

      <PhotoLightbox
        photos={photos}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
        selectedIds={selectedIds}
        onToggle={togglePhoto}
      />

      <div className="mt-8 pt-6 border-t border-zinc-800 space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">Note for your photographer (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any special requests or notes about your selections..."
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
            rows={3}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={submitting || selectedIds.size === 0}
          className="w-full bg-white text-black hover:bg-zinc-200 font-semibold py-6 text-base"
        >
          {submitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>) : (`Submit ${selectedIds.size > 0 ? `${selectedIds.size} ` : ''}Selection${selectedIds.size !== 1 ? 's' : ''}`)}
        </Button>
      </div>
    </div>
  )
}
