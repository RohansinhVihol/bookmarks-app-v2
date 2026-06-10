import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-linear-to-br from-violet-50 via-white to-purple-50">
      
      <div className="space-y-6 max-w-md p-8 rounded-2xl bg-white/70 shadow-xl border border-gray-100 backdrop-blur-md">
        
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Bookmarks
        </h1>

        <p className="text-xl text-gray-600">
          Your personal bookmark collection. Simple, fast, and always accessible.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 hover:scale-105 transition-all duration-200"
          >
            Get started
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 border-2 border-violet-600 text-violet-600 font-semibold rounded-lg hover:bg-violet-50 hover:scale-105 transition-all duration-200"
          >
            Log in
          </Link>

        </div>
      </div>

    </main>
  )
}