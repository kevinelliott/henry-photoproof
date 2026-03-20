import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GalleryCard } from '@/components/GalleryCard'
import { Gallery, Photo } from '@/lib/types'
import { Plus, Camera, LogOut } from 'lucide-react'
import { StartEditingButton } from './StartEditingButton'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: galleries } = await supabase
    .from('galleries')
    .select('*')
    .eq('photographer_id', user.id)
    .order('created_at', { ascending: false })

  const galleryIds = (galleries || []).map((g: Gallery) => g.id)
  const { data: photoCounts } = galleryIds.length > 0
    ? await supabase
        .from('photos')
        .select('gallery_id')
        .in('gallery_id', galleryIds)
    : { data: [] }

  const countMap: Record<string, number> = {}
  ;(photoCounts || []).forEach((p: Pick<Photo, 'gallery_id'>) => {
    countMap[p.gallery_id] = (countMap[p.gallery_id] || 0) + 1
  })

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-900 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-zinc-400" />
            <span className="font-semibold text-white">henry-photoproof</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-sm">{user.email}</span>
            <form action="/api/auth/signout" method="POST">
              <Button variant="ghost" size="sm" type="submit" className="text-zinc-400 hover:text-white">
                <LogOut className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Galleries</h1>
            <p className="text-zinc-400 text-sm mt-1">{(galleries || []).length} gallery{(galleries || []).length !== 1 ? 'ies' : 'y'}</p>
          </div>
          <Link href="/dashboard/new">
            <Button className="bg-white text-black hover:bg-zinc-200 font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              New Gallery
            </Button>
          </Link>
        </div>

        {(galleries || []).length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <Camera className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No galleries yet</p>
            <p className="text-sm mt-1">Create your first gallery to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(galleries as Gallery[]).map((gallery) => (
              <GalleryCard
                key={gallery.id}
                gallery={gallery}
                photoCount={countMap[gallery.id] || 0}
                startEditingButton={
                  gallery.status === 'approved' ? (
                    <StartEditingButton galleryId={gallery.id} />
                  ) : null
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
