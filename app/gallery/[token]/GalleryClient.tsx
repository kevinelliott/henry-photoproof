'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Camera, Heart, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Photo {
  id: string
  filename: string | null
  storage_path: string | null
  url: string | null
  is_selected: boolean
  client_note: string | null
  sort_order: number
}

interface Gallery {
  id: string
  title: string
  client_name: string | null
  client_notes: string | null
  status: string
}

interface GalleryClientProps {
  gallery: Gallery
  photos: Photo[]
  token: string
}

export default function GalleryClient({ gallery, photos, token }: GalleryClientProps) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(photos.filter((p) => p.is_selected).map((p) => p.id))
  )
  const [notes, setNotes] = useState<Record<string, string>>(
    () => Object.fromEntries(photos.filter(p => p.client_note).map(p => [p.id, p.client_note!]))
  )
  const [overallNotes, setOverallNotes] = useState('')
  const [activeNote, setActiveNote] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(gallery.status === 'client_approved')
  const [submitError, setSubmitError] = useState('')

  const isLocked = gallery.status === 'client_approved'

  function toggle(id: string) {
    if (isLocked || submitted) return
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  async function handleSubmit() {
    if (submitting || submitted || selected.size === 0) return
    setSubmitError('')
    setSubmitting(true)

    try {
      const res = await fetch(`/api/galleries/${token}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedPhotoIds: Array.from(selected),
          photo_notes: notes,
          overall_notes: overallNotes,
          status: 'client_approved',
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to submit approval')
      }

      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <nav className="border-b border-white/10 px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-violet-400" />
            <span className="text-xl font-bold">PhotoProof</span>
          </Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md text-center space-y-6">
            <div className="w-20 h-20 bg-green-900/40 border-2 border-green-500/50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold">Selections submitted!</h1>
            <p className="text-slate-400 leading-relaxed">
              Your photographer has been notified. They now have your list of{' '}
              <strong className="text-white">{selected.size} selected photo{selected.size !== 1 ? 's' : ''}</strong>{' '}
              and will begin editing soon.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-400">
              This gallery is now locked. No further changes can be made.
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-violet-400 flex-shrink-0" />
              <span className="font-semibold text-sm truncate">{gallery.title}</span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">Tap photos to select your favorites</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {selected.size > 0 && (
              <span className="text-violet-400 text-sm font-medium hidden sm:block">
                {selected.size} selected
              </span>
            )}
            <button
              onClick={handleSubmit}
              disabled={selected.size === 0 || submitting}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Submit selections</span>
              <span className="sm:hidden">Submit</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {gallery.client_name && (
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 text-sm text-slate-300">
            Hi <strong className="text-white">{gallery.client_name}</strong>! Please browse through
            these proof photos and tap the ones you love.
          </div>
        )}

        {photos.length === 0 ? (
          <div className="text-center py-24">
            <Camera className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No photos uploaded yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {photos.map((photo) => {
              const isSelected = selected.has(photo.id)
              const photoUrl = photo.url
                ?? (photo.storage_path
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${photo.storage_path}`
                  : null)

              return (
                <div
                  key={photo.id}
                  className={cn(
                    'relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-150',
                    isSelected
                      ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-slate-950'
                      : 'ring-1 ring-white/10 hover:ring-white/30'
                  )}
                >
                  <div
                    className="relative aspect-[4/3] bg-slate-800"
                    onClick={() => toggle(photo.id)}
                  >
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={photo.filename ?? 'Photo'}
                        fill
                        className={cn(
                          'object-cover transition-all duration-150',
                          isSelected ? 'brightness-90' : 'group-hover:brightness-95'
                        )}
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-mono px-2 text-center">
                        {photo.filename ?? 'Photo'}
                      </div>
                    )}
                    {isSelected && <div className="absolute inset-0 bg-violet-900/20" />}
                    <div className={cn(
                      'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150',
                      isSelected
                        ? 'bg-violet-600 opacity-100'
                        : 'bg-black/50 opacity-0 group-hover:opacity-100'
                    )}>
                      <Heart className={cn('w-4 h-4', isSelected ? 'fill-white text-white' : 'text-white')} />
                    </div>
                  </div>
                  <div className="bg-slate-900 p-2">
                    {activeNote === photo.id ? (
                      <div className="space-y-1.5">
                        <textarea
                          className="w-full bg-slate-800 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-1 focus:ring-violet-500"
                          placeholder="Add a note..."
                          rows={2}
                          value={notes[photo.id] ?? ''}
                          onChange={(e) => setNotes(prev => ({ ...prev, [photo.id]: e.target.value }))}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveNote(null) }}
                          className="text-xs text-violet-400 hover:text-violet-300"
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveNote(photo.id)}
                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors w-full text-left"
                      >
                        {notes[photo.id] ? (
                          <span className="text-slate-400 italic">&ldquo;{notes[photo.id]}&rdquo;</span>
                        ) : (
                          '+ Add note'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Overall notes + submit */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-3">Overall notes for your photographer</h3>
          <textarea
            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Any overall thoughts, preferences, or special requests..."
            rows={3}
            value={overallNotes}
            onChange={(e) => setOverallNotes(e.target.value)}
          />
          {submitError && (
            <div className="mt-3 bg-red-900/40 border border-red-500/40 text-red-300 rounded-xl px-4 py-2 text-sm">
              {submitError}
            </div>
          )}
          <div className="flex items-center justify-between mt-4">
            <div className="text-slate-400 text-sm">
              {selected.size === 0
                ? 'Select at least one photo to submit'
                : <><span className="text-white font-medium">{selected.size}</span> photo{selected.size !== 1 ? 's' : ''} selected</>
              }
            </div>
            <button
              onClick={handleSubmit}
              disabled={selected.size === 0 || submitting}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Submit final selections
            </button>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-4">
          Powered by <Link href="/" className="text-violet-500 hover:text-violet-400">PhotoProof</Link>
          {token && <span className="text-slate-700"> · Gallery: <span className="font-mono">{token}</span></span>}
        </p>
      </main>
    </div>
  )
}
