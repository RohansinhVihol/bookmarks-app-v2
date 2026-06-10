'use client'

import { useRouter } from 'next/navigation'

type Profile = {
  id: string
  handle: string
  created_at: string
}

type UserProps = {
  profiles: Profile[]
}

export default function User({ profiles }: UserProps) {
  const router = useRouter()

  const onclickHandler = (name: string) => {
    router.push(`/@${name}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:p-6">
      
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
            All Users
          </h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-500">
            Browse all public profiles
          </p>
        </div>

        {/* List */}
        <div className="grid gap-3 sm:gap-4">

          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => onclickHandler(profile.handle)}
              className="group w-full text-left rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-200 hover:border-violet-300 hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-3">

                {/* Left */}
                <div className="min-w-0">
                  <h2 className="text-base sm:text-xl font-semibold text-gray-900 truncate">
                    {profile.handle}
                  </h2>
                  <p className="mt-0.5 text-xs sm:text-sm text-gray-500 truncate">
                    @{profile.handle}
                  </p>
                </div>

                {/* Right badge */}
                <div className="shrink-0 rounded-full bg-violet-100 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-violet-700 transition-colors group-hover:bg-violet-600 group-hover:text-white">
                  View
                </div>

              </div>
            </button>
          ))}

        </div>

      </div>
    </div>
  )
}