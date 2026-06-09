'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function getAuthenticatedUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, user }
}

function validateBookmarkInputs(title: string, url: string): string | null {
  if (!title?.trim() || !url?.trim()) return 'Title and URL are required'
  try {
    new URL(url)
  } catch {
    return 'Invalid URL format'
  }
  if (title.trim().length > 200) return 'Title must be under 200 characters'
  return null
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function addBookmark(formData: FormData) {
  const { supabase, user } = await getAuthenticatedUser()
  if (!user) return { error: 'Not authenticated' }

  const title = (formData.get('title') as string)?.trim()
  const url = (formData.get('url') as string)?.trim()
  const is_public = formData.get('is_public') === 'on'

  const validationError = validateBookmarkInputs(title, url)
  if (validationError) return { error: validationError }

  const { error } = await supabase
    .from('bookmarks')
    .insert({ user_id: user.id, title, url, is_public })

  if (error) return { error: error.message }

  revalidatePath('/dashboard', 'layout')
  return { success: true }
}

export async function updateBookmark(id: string, formData: FormData) {
  if (!id) return { error: 'Bookmark ID is required' }

  const { supabase, user } = await getAuthenticatedUser()
  if (!user) return { error: 'Not authenticated' }

  const title = (formData.get('title') as string)?.trim()
  const url = (formData.get('url') as string)?.trim()
  const is_public = formData.get('is_public') === 'on'

  const validationError = validateBookmarkInputs(title, url)
  if (validationError) return { error: validationError }

  // RLS ensures user can only update their own bookmarks
  // .eq('user_id', user.id) added as defense-in-depth beyond RLS
  const { error } = await supabase
    .from('bookmarks')
    .update({ title, url, is_public })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard', 'layout')
  return { success: true }
}

export async function deleteBookmark(id: string) {
  if (!id) return { error: 'Bookmark ID is required' }

  const { supabase, user } = await getAuthenticatedUser()
  if (!user) return { error: 'Not authenticated' }

  // RLS ensures user can only delete their own bookmarks
  // .eq('user_id', user.id) added as defense-in-depth beyond RLS
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard', 'layout')
  return { success: true }
}