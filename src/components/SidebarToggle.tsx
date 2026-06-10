'use client'

import { useState } from 'react'
import User from '@/components/AllUser'

type Profile = {
  id: string
  handle: string
  created_at: string
}

export default function SidebarToggle({ profiles }: { profiles: Profile[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* MOBILE BUTTON ONLY */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 md:hidden bg-violet-600 text-white px-4 py-2 rounded-full shadow-lg"
      >
        Users
      </button>

      {/* MOBILE SIDEBAR */}
      <aside
        className={`
          fixed md:hidden top-0 left-0 h-full w-80 bg-white border-r shadow-lg z-50
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Users</h2>

          <button onClick={() => setOpen(false)}>✕</button>
        </div>

        <div className="p-4 overflow-y-auto h-full">
          <User profiles={profiles} />
        </div>
      </aside>

      {/* OVERLAY (mobile only) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}
    </>
  )
}