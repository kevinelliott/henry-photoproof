import { createServiceRoleClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Gallery, Photo } from '@/lib/types'
import { ClientGallery } from './ClientGallery'
import { Camera } from 'lucide-react'

interface Props {
  params: Promise<{ token: string }>
}

export default async function GalleryPage({ params }: Props) {
  const { token } = await params
  const supabase = await createServiceRoleClient()

  const { data: gallery } = await supabase
    .from('galleries')
    .select('*')
    .eq('token', token)
    .single()

  if (!gallery) notFound()

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('gallery_id', gallery.id)
    .order('sort_order', { ascending: true })

  const isLocked = gallery.status !== 'pending'

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-900 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-zinc-400" />
            <span className="text-white font-semibold">{(gallery as Gallery).name}</span>
          </div>
          {isLocked && (
            <div className="text-sm text-emerald-400 font-medium">
              ✓ Selections submitted
            </div>
          )}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <ClientGallery
          gallery={gallery as Gallery}
          photos={(photos || []) as Photo[]}
          isLocked={isLocked}
        />
      </main>
    </div>
  )
}
