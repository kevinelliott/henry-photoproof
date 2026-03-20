import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseKey)
}

// Singleton for use in API routes (server-side)
export const supabase = createSupabaseClient(supabaseUrl, supabaseKey)
