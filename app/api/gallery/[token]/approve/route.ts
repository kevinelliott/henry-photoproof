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
    return NextResponse.json({ error: 'Gallery already approved' }, { status: 409 })
  }

  const body = await request.json()
  const { note } = body as { note?: string }

  const { data, error } = await supabase
    .from('galleries')
    .update({ status: 'approved', client_note: note || null, approved_at: new Date().toISOString() })
    .eq('id', gallery.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
