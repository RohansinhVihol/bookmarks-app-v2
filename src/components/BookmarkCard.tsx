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
      if (result?.error) {
        setError(result.error)
      } else {
        setIsEditing(false)
      }
    })
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this bookmark?')) return

    startTransition(async () => {
      const result = await deleteBookmark(bookmark.id)
      if (result?.error) {
        alert(result.error)
      }
    })
  }

  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg border border-violet-200 shadow-sm">
        <form action={handleUpdate} className="space-y-3">
          <input
            type="text"
            name="title"
            defaultValue={bookmark.title}
            required
            className="w-full px-3 py-1.5 border rounded focus:ring-2 focus:ring-violet-500 outline-none"
          />
          <input
            type="url"
            name="url"
            defaultValue={bookmark.url}
            required
            className="w-full px-3 py-1.5 border rounded focus:ring-2 focus:ring-violet-500 outline-none"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_public"
              id={`edit-public-${bookmark.id}`}
              defaultChecked={bookmark.is_public}
              className="w-4 h-4 text-violet-600 rounded"
            />
            <label htmlFor={`edit-public-${bookmark.id}`} className="text-sm text-gray-600">
              Public
            </label>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-3 py-1 text-sm bg-violet-600 text-white rounded hover:bg-violet-700 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:border-gray-200 transition-colors group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-gray-900 hover:text-violet-600 transition-colors truncate block"
            >
              {bookmark.title}
            </a>
            {bookmark.is_public && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 rounded-full">
                Public
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{bookmark.url}</p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
            title="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
