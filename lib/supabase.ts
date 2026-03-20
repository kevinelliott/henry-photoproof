/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

function getUrl() { return process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"; }
function getAnonKey() { return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"; }
function getServiceKey() { return process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key"; }

// Browser client factory for client components
export function createClient() {
  return createBrowserClient(getUrl(), getAnonKey());
}

export function getSupabase(): SupabaseClient { return createSupabaseClient(getUrl(), getAnonKey()); }
export function createServiceClient(): SupabaseClient { return createSupabaseClient(getUrl(), getServiceKey()); }

let _supabase: SupabaseClient | null = null;
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target: SupabaseClient, prop: string | symbol) {
    if (!_supabase) _supabase = createSupabaseClient(getUrl(), getAnonKey());
    return (_supabase as any)[prop];
  }
});
