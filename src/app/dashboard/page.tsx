import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
// These components are expected to be in the same directory or a components folder.
// I'll provide skeleton implementations or imports here.
// Assuming they are in a subfolder or I should implement them.
// Since the user asked for "complete TSX code" for this file:
import { AddBookmarkForm } from '@/components/AddBookmarkForm'
import { BookmarkList } from '@/components/BookmarkList'


export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Add New Bookmark</h2>
        <AddBookmarkForm />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Your Bookmarks</h2>
        <BookmarkList bookmarks={bookmarks ?? []} />
      </section>
    </div>
  )
}
