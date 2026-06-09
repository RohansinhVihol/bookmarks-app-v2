'use client'

import { Bookmark } from '@/lib/types'
import { BookmarkCard } from './BookmarkCard'

interface BookmarkListProps {
  bookmarks: Bookmark[]
}

export function BookmarkList({ bookmarks }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-400">No bookmarks yet. Start by adding one above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  )
}
