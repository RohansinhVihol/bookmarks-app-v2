import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | null = null

/**
 * Returns a Supabase client for use in Client Components only.
 *
 * ⚠️  Do NOT use in Server Components, Server Actions, or API Routes.
 *     For server-side usage, use createServerClient() instead.
 *
 * Singleton pattern — reuses the same instance across calls
 * to avoid creating multiple GoTrue auth listeners.
 */
export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  

  if (!supabaseUrl) {
    throw new Error('[createClient] Missing NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!supabaseAnonKey) {
    throw new Error('[createClient] Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return client
}