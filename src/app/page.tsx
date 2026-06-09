import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Bookmarks
        </h1>
        <p className="text-xl text-gray-600">
          Your personal bookmark collection. Simple, fast, and always accessible.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 border-2 border-violet-600 text-violet-600 font-semibold rounded-lg hover:bg-violet-50 transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  )
}
