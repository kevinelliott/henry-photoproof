'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Upload, X, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'

interface FilePreview {
  file: File
  previewUrl: string
}

export default function NewGalleryPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [files, setFiles] = useState<FilePreview[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || [])
    const previews: FilePreview[] = selected.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    setFiles((prev) => [...prev, ...previews])
  }

  function removeFile(index: number) {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !clientEmail) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, client_email: clientEmail }),
      })
      if (!res.ok) throw new Error('Failed to create gallery')
      const gallery = await res.json()

      if (files.length > 0) {
        const formData = new FormData()
        files.forEach(({ file }) => formData.append('photos', file))

        const uploadRes = await fetch(`/api/galleries/${gallery.id}/photos`, {
          method: 'POST',
          body: formData,
        })
        if (!uploadRes.ok) throw new Error('Failed to upload photos')
      }

      toast.success('Gallery created!')
      router.push('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-900 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-zinc-400" />
            <span className="font-semibold text-white">New Gallery</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Gallery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Gallery Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Smith Wedding 2024"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Client Email</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Upload Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-500 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-3 text-zinc-500" />
                <p className="text-zinc-400 text-sm">Click to upload photos</p>
                <p className="text-zinc-600 text-xs mt-1">JPG, PNG, WEBP up to 20MB each</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />

              {files.length > 0 && (
                <div className="mt-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {files.map((f, i) => (
                    <div key={i} className="relative aspect-square rounded-md overflow-hidden group">
                      <Image src={f.previewUrl} alt={f.file.name} fill className="object-cover" />
                      <button type="button" onClick={() => removeFile(i)} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <X className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {files.length > 0 && (
                <p className="mt-3 text-sm text-zinc-400">{files.length} photo{files.length !== 1 ? 's' : ''} selected</p>
              )}
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-zinc-200 font-semibold">
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating Gallery...</>
            ) : (
              'Create Gallery'
            )}
          </Button>
        </form>
      </main>
    </div>
  )
}
