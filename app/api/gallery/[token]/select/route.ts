import { createServiceRoleClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createServiceRoleClient()

  const { data: gallery } = await supabase
    .from('galleries')
    .select('id, status')
    .eq('token', token)
    .single()

  if (!gallery) return NextResponse.json({ error: 'Gallery not found' }, { status: 404 })
  if (gallery.status !== 'pending') {
    return NextResponse.json({ error: 'Gallery is locked' }, { status: 403 })
  }

  const body = await request.json()
  const { selected_ids } = body as { selected_ids: string[] }

  await supabase.from('photos').update({ selected: false }).eq('gallery_id', gallery.id)

  if (selected_ids.length > 0) {
    await supabase.from('photos').update({ selected: true }).in('id', selected_ids).eq('gallery_id', gallery.id)
  }

  return NextResponse.json({ ok: true })
}
