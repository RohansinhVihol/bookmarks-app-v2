'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendWelcomeEmail } from '@/lib/email'

// ─── Validation ────────────────────────────────────────────────────────────────

const HANDLE_REGEX = /^[a-z0-9_]{3,20}$/

function validateSignUpInputs(
  email: string,
  password: string,
  handle: string
): string | null {
  if (!email || !email.includes('@')) {
    return 'Please enter a valid email address.'
  }
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters.'
  }
  if (!HANDLE_REGEX.test(handle)) {
    return 'Handle must be 3–20 characters: letters, numbers, underscores only.'
  }
  return null
}

// ─── Actions ───────────────────────────────────────────────────────────────────

export async function signUp(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string
  const handle = (formData.get('handle') as string)?.toLowerCase().trim()

  console.log('1. signUp called:', { email, handle })


  // Validate all inputs upfront
  const validationError = validateSignUpInputs(email, password, handle)
  console.log('2. Validation:', validationError)
  if (validationError) return { error: validationError }

  const admin = createAdminClient()

  // Check handle availability
  // NOTE: Small race condition window exists here — handle uniqueness is
  // ultimately enforced by a unique constraint on profiles.handle in the DB.
  const { data: existing , error: handleError } = await admin
    .from('profiles')
    .select('id')
    .eq('handle', handle)
    .maybeSingle()   //change 
  


  console.log('3. Handle check:', { existing, handleError })

  if (existing) {
    return { error: 'That handle is already taken.' }
  }

  const supabase = await createClient()

  // Create auth user
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  })
  console.log('4. Auth signUp:', { user: data?.user?.id, signUpError })

  if (signUpError) return { error: signUpError.message }
  if (!data.user) return { error: 'Failed to create account. Please try again.' }

  // Create profile — if this fails, clean up the orphaned auth user
 const { error: profileError } = await admin
  .from('profiles')
  .insert({ 
    id: data.user.id, 
    handle,
    created_at: new Date().toISOString() // ✅ add karo
  })

  console.log('5. Profile insert:', { profileError })  

  if (profileError) {
    // Rollback: delete the auth user so they can try again cleanly
    await admin.auth.admin.deleteUser(data.user.id)

    // Unique constraint violation = handle was race-condition sniped
    if (profileError.code === '23505') {
      return { error: 'That handle was just taken. Please choose another.' }
    }

    return { error: 'Failed to create profile. Please try again.' }
  }

  // Send welcome email — non-fatal, don't block signup on email failure
  try {
    await sendWelcomeEmail(email, handle)
  } catch (err) {
    console.error('[signUp] Welcome email failed:', err)
  }

  // revalidatePath('/', 'layout')
  // redirect('/dashboard')
  revalidatePath('/', 'layout')
  console.log('6. Redirecting to dashboard...')  // ← add karo
  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}