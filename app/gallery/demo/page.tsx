'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Camera, CheckCircle, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DemoPhoto {
  id: string
  url: string
  filename: string
}

const demoPhotos: DemoPhoto[] = Array.from({ length: 12 }, (_, i) => ({
  id: `demo-${i + 1}`,
  url: `https://picsum.photos/seed/photo${i + 1}/800/600`,
  filename: `photo-${String(i + 1).padStart(2, '0')}.jpg`,
}))

export default function DemoGalleryPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [overallNotes, setOverallNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [activeNote, setActiveNote] = useState<string | null>(null)

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleSubmit() {
    if (selected.size === 0) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-900/40 border-2 border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Selections submitted!</h1>
          <p className="text-slate-400 mb-2">
            You selected <strong className="text-white">{selected.size} photos</strong> from this demo gallery.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            In a real gallery, your photographer would now receive your selections and can begin editing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setSubmitted(false); setSelected(new Set()) }}
              className="border border-white/20 hover:border-white/40 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Try again
            </button>
            <Link
              href="/signup"
              className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              Create your free account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-white/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors flex-shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span className="font-semibold text-sm truncate">Demo Gallery</span>
                <span className="hidden sm:inline text-violet-400 text-xs border border-violet-500/30 bg-violet-900/20 px-2 py-0.5 rounded-full">
                  Demo
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">Tap photos to select your favorites</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {selected.size > 0 && (
              <span className="text-violet-400 text-sm font-medium">
                {selected.size} selected
              </span>
            )}
            <button
              onClick={handleSubmit}
              disabled={selected.size === 0}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Submit selections</span>
              <span className="sm:hidden">Submit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gallery info */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <div className="bg-violet-900/20 border border-violet-500/20 rounded-xl px-4 py-3 text-sm text-violet-300">
          <strong>Demo gallery</strong> — Tap any photo to heart it, add notes, and submit your selections. No login needed.
        </div>
      </div>

      {/* Photo grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {demoPhotos.map((photo) => {
            const isSelected = selected.has(photo.id)
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
                {/* Photo */}
                <div
                  className="relative aspect-[4/3] bg-slate-800"
                  onClick={() => toggleSelect(photo.id)}
                >
                  <Image
                    src={photo.url}
                    alt={photo.filename}
                    fill
                    className={cn(
                      'object-cover transition-all duration-150',
                      isSelected ? 'brightness-90' : 'group-hover:brightness-95'
                    )}
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />

                  {isSelected && (
                    <div className="absolute inset-0 bg-violet-900/20" />
                  )}

                  <div className={cn(
                    'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150',
                    isSelected
                      ? 'bg-violet-600 opacity-100'
                      : 'bg-black/50 opacity-0 group-hover:opacity-100'
                  )}>
                    <Heart
                      className={cn('w-4 h-4', isSelected ? 'fill-white text-white' : 'text-white')}
                    />
                  </div>

                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                    {photo.filename}
                  </div>
                </div>

                {/* Note section */}
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
      </div>

      {/* Footer / Submit section */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-3">Overall notes for your photographer</h3>
          <textarea
            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Any overall thoughts, preferences, or requests for your photographer..."
            rows={3}
            value={overallNotes}
            onChange={(e) => setOverallNotes(e.target.value)}
          />
          <div className="flex items-center justify-between mt-4">
            <div className="text-slate-400 text-sm">
              {selected.size === 0 ? (
                'Select at least one photo to submit'
              ) : (
                <>
                  <span className="text-white font-medium">{selected.size}</span>
                  {' '}photo{selected.size !== 1 ? 's' : ''} selected
                </>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={selected.size === 0}
              className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Submit final selections
            </button>
          </div>
        </div>
        <p className="text-center text-slate-600 text-xs mt-4">
          Powered by <Link href="/" className="text-violet-500 hover:text-violet-400">PhotoProof</Link>
          {' '}·{' '}
          <Link href="/signup" className="text-violet-500 hover:text-violet-400">Create your own gallery</Link>
        </p>
      </div>
    </div>
  )
}
