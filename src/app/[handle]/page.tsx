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
  
  // Query profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, handle')
    .eq('handle', handle)
    .single()
    
  if (profileError || !profile) {
    notFound()
  }
  
  // Query public bookmarks
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
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">
        {profile.handle}
      </h1>
      <p className="text-gray-500 mb-8">
        {bookmarkCount} public bookmark(s)
      </p>

      {!bookmarks || bookmarks.length === 0 ? (
        <p className="text-gray-400 italic">No public bookmarks yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {bookmarks.map((bookmark) => (
            <a
              key={bookmark.id}
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:border-violet-500 transition-colors"
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
    </main>
  )
}
