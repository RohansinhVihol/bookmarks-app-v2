'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendWelcomeEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const rawHandle = formData.get('handle') as string;

  const handle = rawHandle.toLowerCase().trim();

  // Validate handle
  const handleRegex = /^[a-z0-9_]{3,20}$/;
  if (!handleRegex.test(handle)) {
    return { error: 'Invalid handle. Use 3-20 characters (a-z, 0-9, _).' };
  }

  const supabaseAdmin = createAdminClient();
  const supabase = await createClient();

  // Check if handle already exists
  const { data: existingProfile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('handle', handle)
    .single();

  if (existingProfile) {
    return { error: 'Handle already taken.' };
  }

  // Sign up the user
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    return { error: signUpError.message };
  }

  if (!user) {
    return { error: 'Failed to create user.' };
  }

  // Insert profile using admin client
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({ id: user.id, handle });

  if (profileError) {
    return { error: profileError.message };
  }

  // Send welcome email
  await sendWelcomeEmail(email, handle);

  revalidatePath('/');
  redirect('/dashboard');
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  redirect('/dashboard');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
