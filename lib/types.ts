export type GalleryStatus = 'pending' | 'approved' | 'editing' | 'complete'

export interface Gallery {
  id: string
  token: string
  name: string
  client_email: string
  photographer_id: string
  status: GalleryStatus
  client_note: string | null
  created_at: string
  approved_at: string | null
}

export interface Photo {
  id: string
  gallery_id: string
  storage_path: string
  filename: string
  sort_order: number
  selected: boolean
  created_at: string
}
