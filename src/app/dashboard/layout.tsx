import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ReactNode } from 'react'

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('handle')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-gray-900">Bookmarks</span>
            {profile?.handle && (
              <Link
                href={`/${profile.handle}`} /* Removed target="_blank" so the profile opens in the same tab instead of a new tab */
                className="text-violet-600 hover:text-violet-700 font-medium"
              >
                @{profile.handle}
              </Link>
            )}
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
