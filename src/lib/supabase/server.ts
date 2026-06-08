import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for use in:
 * - Server Components
 * - Server Actions
 * - Route Handlers
 *
 * ⚠️  Do NOT use in Client Components — use createBrowserClient() instead.
 *     Cookie writes are best-effort: they succeed in Server Actions/Route Handlers
 *     but are silently ignored in Server Components (read-only context).
 *     Ensure proxy is set up to refresh sessions in those cases.
 */
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('[createClient] Missing NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!supabaseAnonKey) {
    throw new Error('[createClient] Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Expected in Server Components — cookies() is read-only there.
          // Session refresh is handled by proxy instead.
          // Safe to ignore as long as proxy.ts is configured correctly.
        }
      },
    },
  })
}