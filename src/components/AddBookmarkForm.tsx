'use client'

import { useState, useRef, useTransition } from 'react'
import { addBookmark } from '@/app/dashboard/actions'

export function AddBookmarkForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setError(null)

    startTransition(async () => {
      const result = await addBookmark(formData)

      if (result?.error) {
        setError(result.error)
      } else {
        formRef.current?.reset()
      }
    })
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
      
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
        Add bookmark
      </h2>

      <form ref={formRef} action={handleSubmit} className="space-y-4">

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            placeholder="e.g. My Favorite Blog"
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition"
          />
        </div>

        {/* URL */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            type="url"
            name="url"
            id="url"
            required
            placeholder="https://example.com"
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition"
          />
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_public"
            id="is_public"
            className="w-4 h-4 accent-violet-600"
          />
          <label htmlFor="is_public" className="text-sm text-gray-600">
            Make public (visible to everyone)
          </label>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 sm:py-2.5 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
        >
          {isPending ? 'Adding...' : 'Add Bookmark'}
        </button>

      </form>
    </div>
  )
}