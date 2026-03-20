'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export function StartEditingButton({ galleryId }: { galleryId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch(`/api/galleries/${galleryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'editing' }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      toast.success('Editing started!')
      router.refresh()
    } catch {
      toast.error('Could not start editing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      size="sm"
      className="bg-emerald-600 hover:bg-emerald-500 text-white"
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? 'Starting...' : 'Start Editing'}
    </Button>
  )
}
