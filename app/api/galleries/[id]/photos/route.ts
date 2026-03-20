import { createServerSupabaseClient, createServiceRoleClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('gallery_id', id)
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: gallery } = await supabase
    .from('galleries')
    .select('id')
    .eq('id', id)
    .eq('photographer_id', user.id)
    .single()

  if (!gallery) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const formData = await request.formData()
  const photos = formData.getAll('photos') as File[]

  if (!photos.length) {
    return NextResponse.json({ error: 'No photos provided' }, { status: 400 })
  }

  const serviceClient = await createServiceRoleClient()
  const inserted = []

  for (let i = 0; i < photos.length; i++) {
    const file = photos[i]
    const ext = file.name.split('.').pop()
    const storagePath = `${id}/${Date.now()}-${i}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadError } = await serviceClient.storage
      .from('photos')
      .upload(storagePath, arrayBuffer, { contentType: file.type, upsert: false })

    if (uploadError) { console.error('Upload error:', uploadError); continue }

    const { data: photo } = await serviceClient
      .from('photos')
      .insert({ gallery_id: id, storage_path: storagePath, filename: file.name, sort_order: i })
      .select()
      .single()

    if (photo) inserted.push(photo)
  }

  return NextResponse.json(inserted, { status: 201 })
}
