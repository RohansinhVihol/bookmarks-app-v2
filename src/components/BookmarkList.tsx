'use client'

import type { Bookmark } from '@/lib/types'
import { BookmarkCard } from './BookmarkCard'

export function BookmarkList({ bookmarks }: { bookmarks: Bookmark[] }) {
  if (bookmarks.length === 0) {
    return (
      <div className="py-10 md:py-16 text-center">
        <p className="text-gray-400 text-sm md:text-base">
          No bookmarks yet. Start by adding one above!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-5">
      
      {/* Header */}
      <h2 className="font-semibold text-gray-900 text-base md:text-lg">
        Your bookmarks{' '}
        <span className="text-gray-500 font-normal">
          ({bookmarks.length})
        </span>
      </h2>

      {/* List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {bookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} bookmark={bookmark} />
        ))}
      </div>

    </div>
  )
}