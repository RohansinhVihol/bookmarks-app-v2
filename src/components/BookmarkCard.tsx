'use client'

import { useState, useTransition } from 'react'
import { Bookmark } from '@/lib/types'
import { updateBookmark, deleteBookmark } from '@/app/dashboard/actions'

interface BookmarkCardProps {
  bookmark: Bookmark
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleUpdate(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const result = await updateBookmark(bookmark.id, formData)
      if (result?.error) setError(result.error)
      else setIsEditing(false)
    })
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this bookmark?')) return

    startTransition(async () => {
      const result = await deleteBookmark(bookmark.id)
      if (result?.error) alert(result.error)
    })
  }

  if (isEditing) {
    return (
      <div className="bg-white p-3 md:p-4 rounded-lg border border-violet-200 shadow-sm">
        <form action={handleUpdate} className="space-y-3">
          <input
            type="text"
            name="title"
            defaultValue={bookmark.title}
            required
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-500 outline-none text-sm md:text-base"
          />
          <input
            type="url"
            name="url"
            defaultValue={bookmark.url}
            required
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-violet-500 outline-none text-sm md:text-base"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_public"
              id={`edit-public-${bookmark.id}`}
              defaultChecked={bookmark.is_public}
              className="w-4 h-4"
            />
            <label htmlFor={`edit-public-${bookmark.id}`} className="text-sm text-gray-600">
              Public
            </label>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-3 py-2 text-sm bg-violet-600 text-white rounded hover:bg-violet-700 disabled:opacity-50 w-full sm:w-auto"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-100 shadow-sm hover:border-gray-200 transition-colors group">
      
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        
        {/* Left content */}
        <div className="flex-1 min-w-0">
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base md:text-lg font-semibold text-gray-900 hover:text-violet-600 transition-colors break-words"
            >
              {bookmark.title}
            </a>

            {bookmark.is_public && (
              <span className="w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 rounded-full">
                Public
              </span>
            )}
          </div>

          <p className="text-xs md:text-sm text-gray-500 break-all sm:truncate">
            {bookmark.url}
          </p>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col flex-row items-center sm:items-end gap-2 sm:gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded"
            title="Edit"
          >
            ✏️
          </button>

          <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
            title="Delete"
          >
            🗑️
          </button>

        </div>
      </div>
    </div>
  )
}