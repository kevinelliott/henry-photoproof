import { createServiceRoleClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Camera } from 'lucide-react'
import { Gallery } from '@/lib/types'

interface Props {
  params: Promise<{ token: string }>
}

export default async function SuccessPage({ params }: Props) {
  const { token } = await params
  const supabase = await createServiceRoleClient()

  const { data: gallery } = await supabase
    .from('galleries')
    .select('*')
    .eq('token', token)
    .single()

  const selectedCount = gallery
    ? (await supabase.from('photos').select('id').eq('gallery_id', gallery.id).eq('selected', true)).data?.length || 0
    : 0

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-emerald-400" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">All done!</h1>
      <p className="text-zinc-400 text-lg mb-2">Your selections have been submitted.</p>
      {gallery && (
        <p className="text-zinc-500 text-sm mb-8">
          You selected <span className="text-zinc-300 font-medium">{selectedCount} photo{selectedCount !== 1 ? 's' : ''}</span> from <span className="text-zinc-300 font-medium">{(gallery as Gallery).name}</span>
        </p>
      )}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 max-w-sm w-full mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Camera className="w-4 h-4 text-zinc-400" />
          <p className="text-zinc-300 font-medium text-sm">What happens next?</p>
        </div>
        <p className="text-zinc-500 text-sm text-left">Your photographer has been notified and will begin editing your selected photos. You&apos;ll hear from them soon!</p>
      </div>
      {gallery && (
        <Link href={`/gallery/${token}`}>
          <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">View your selections</Button>
        </Link>
      )}
    </div>
  )
}
