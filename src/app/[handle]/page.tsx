import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params
  return {
    title: `${handle} — Bookmarks`,
  }
}

export default async function PublicHandlePage({ params }: PageProps) {
  const { handle: rawHandle } = await params
  const handle = rawHandle.toLowerCase()

  const supabase = createAdminClient()

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, handle')
    .eq('handle', handle)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  const { data: bookmarks, error: bookmarksError } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (bookmarksError) {
    console.error('Error fetching bookmarks:', bookmarksError)
  }

  const bookmarkCount = bookmarks?.length || 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 py-12 px-4">
      
      {/* Profile Header */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="bg-white/70 backdrop-blur-md border border-gray-100 shadow-md rounded-2xl p-6 flex items-center gap-4">
          
          <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center text-white text-xl font-bold uppercase">
            {profile.handle[0]}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              @{profile.handle}
            </h1>
            <p className="text-gray-500 text-sm">
              {bookmarkCount} public bookmark(s)
            </p>
          </div>

        </div>
      </div>

      {/* Bookmarks */}
      <div className="max-w-2xl mx-auto">
        
        {!bookmarks || bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 italic text-lg">
              No public bookmarks yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookmarks.map((bookmark) => (
              <a
                key={bookmark.id}
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/80 backdrop-blur-md border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-violet-400 transition-all duration-200"
              >
                <h2 className="font-semibold text-gray-900 truncate group-hover:text-violet-600 transition-colors">
                  {bookmark.title}
                </h2>
                <p className="text-sm text-gray-500 truncate">
                  {bookmark.url}
                </p>
              </a>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}