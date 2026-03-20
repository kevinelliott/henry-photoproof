import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { Gallery, Photo } from '@/lib/types'
import { ArrowLeft, Camera } from 'lucide-react'
import { GalleryDetailClient } from './GalleryDetailClient'

interface Props {
  params: Promise<{ id: string }>
}

export default async function GalleryDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: gallery } = await supabase
    .from('galleries')
    .select('*')
    .eq('id', id)
    .eq('photographer_id', user.id)
    .single()

  if (!gallery) notFound()

  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('gallery_id', id)
    .order('sort_order', { ascending: true })

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-900 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-zinc-400" />
              <span className="font-semibold text-white">{(gallery as Gallery).name}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={(gallery as Gallery).status} />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <GalleryDetailClient gallery={gallery as Gallery} photos={(photos || []) as Photo[]} />
      </main>
    </div>
  )
}
