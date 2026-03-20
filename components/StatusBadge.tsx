import { Badge } from '@/components/ui/badge'
import { GalleryStatus } from '@/lib/types'
import { Clock, CheckCircle, Pencil, Star } from 'lucide-react'

const statusConfig: Record<GalleryStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType; className: string }> = {
  pending: {
    label: 'Awaiting Approval',
    variant: 'outline',
    icon: Clock,
    className: 'border-amber-500 text-amber-400 bg-amber-500/10',
  },
  approved: {
    label: 'Client Approved',
    variant: 'outline',
    icon: CheckCircle,
    className: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
  },
  editing: {
    label: 'Editing in Progress',
    variant: 'outline',
    icon: Pencil,
    className: 'border-blue-500 text-blue-400 bg-blue-500/10',
  },
  complete: {
    label: 'Complete',
    variant: 'outline',
    icon: Star,
    className: 'border-purple-500 text-purple-400 bg-purple-500/10',
  },
}

export function StatusBadge({ status }: { status: GalleryStatus }) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className={`flex items-center gap-1.5 text-xs font-medium ${config.className}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  )
}
