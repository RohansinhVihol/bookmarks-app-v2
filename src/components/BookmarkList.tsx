'use client'

import type { Bookmark } from '@/lib/types'
import { BookmarkCard } from './BookmarkCard'

export function BookmarkList({ bookmarks }: { bookmarks: Bookmark[] }) {
  if (bookmarks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-400">No bookmarks yet. Start by adding one above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-gray-900">
        Your bookmarks ({bookmarks.length})  {/* count = useful */}
      </h2>
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  )
}