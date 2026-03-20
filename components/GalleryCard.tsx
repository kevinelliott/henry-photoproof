'use client'

import Link from 'next/link'
import { Gallery } from '@/lib/types'
import { StatusBadge } from './StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Images } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ReactNode } from 'react'

interface GalleryCardProps {
  gallery: Gallery
  photoCount?: number
  startEditingButton?: ReactNode
}

export function GalleryCard({ gallery, photoCount = 0, startEditingButton }: GalleryCardProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-white text-lg font-semibold leading-tight">{gallery.name}</CardTitle>
          <StatusBadge status={gallery.status} />
        </div>
        <p className="text-zinc-400 text-sm">{gallery.client_email}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-zinc-500 text-sm mb-4">
          <Images className="w-4 h-4" />
          <span>{photoCount} photo{photoCount !== 1 ? 's' : ''}</span>
          <span className="text-zinc-700">·</span>
          <span>{formatDistanceToNow(new Date(gallery.created_at), { addSuffix: true })}</span>
        </div>

        {gallery.client_note && (
          <div className="mb-4 p-3 rounded-lg bg-zinc-800 border border-zinc-700">
            <p className="text-xs text-zinc-400 font-medium mb-1">Client Note</p>
            <p className="text-sm text-zinc-300 italic">"{gallery.client_note}"</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Link href={`/dashboard/gallery/${gallery.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              View Gallery
            </Button>
          </Link>
          <Link href={`/gallery/${gallery.token}`} target="_blank">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
          {startEditingButton}
        </div>
      </CardContent>
    </Card>
  )
}
