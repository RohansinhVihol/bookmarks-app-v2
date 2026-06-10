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
    router.push(`/${name}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">All Users</h1>
          <p className="mt-2 text-gray-500">Browse all public profiles</p>
        </div>

        <div className="grid gap-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => onclickHandler(profile.handle)}
              className="group cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{profile.handle}</h2>
                  <p className="mt-1 text-sm text-gray-500">@{profile.handle}</p>
                </div>
                <div className="rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700 transition-colors group-hover:bg-violet-600 group-hover:text-white">
                  View
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}