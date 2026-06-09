import { createClient } from '@supabase/supabase-js'
import { log } from 'console'

/**
 * Creates a Supabase admin client with service role privileges.
 *
 * ⚠️  NEVER import or call this in client components or browser code.
 *     The service role key bypasses ALL Row Level Security (RLS).
 *     Only use in: API Routes, Server Actions, Route Handlers.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  
  
  

  if (!supabaseUrl) {
    throw new Error('[createAdminClient] Missing NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!serviceRoleKey) {
    throw new Error('[createAdminClient] Missing SUPABASE_SERVICE_ROLE_KEY')
  }

  // Extra guard: catch accidental client-side usage at runtime
  if (typeof window !== 'undefined') {
    throw new Error('[createAdminClient] Must not be called in the browser')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'x-admin-request': 'true', // useful for logging/auditing in Supabase dashboard
      },
    },
  })
}