import { Resend } from 'resend'

// Singleton — avoid creating a new instance on every call
const resend = new Resend(process.env.RESEND_API_KEY)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const FROM_EMAIL = 'Bookmarks <onboarding@resend.dev>'

// ─── Templates ─────────────────────────────────────────────────────────────────

function welcomeEmailHtml(handle: string, profileUrl: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #111;">Welcome, @${handle}! 👋</h1>
      <p style="font-size: 16px; line-height: 1.5; color: #444;">
        We're excited to have you on Bookmarks. Your public profile is now ready!
      </p>
      <div style="margin: 32px 0;">
        <a href="${profileUrl}"
           style="background-color: #6c47ff; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 8px; font-weight: 600;
                  display: inline-block;">
          View Your Profile
        </a>
      </div>
      <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
      <p style="font-size: 14px; color: #666;">
        Next step: Start adding your favorite bookmarks from your 
        <a href="${SITE_URL}/dashboard" style="color: #6c47ff;">dashboard</a>
        to build your collection.
      </p>
    </div>
  `
}

// ─── Emails ────────────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(
  email: string,
  handle: string
): Promise<{ success: boolean; error?: unknown }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[sendWelcomeEmail] RESEND_API_KEY not set — skipping email')
    return { success: false, error: 'Missing RESEND_API_KEY' }
  }

  const profileUrl = `${SITE_URL}/@${handle}`

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Welcome to Bookmarks, @${handle}!`,
      html: welcomeEmailHtml(handle, profileUrl),
    })

    if (error) {
      console.error('[sendWelcomeEmail] Resend error:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (err) {
    console.error('[sendWelcomeEmail] Unexpected error:', err)
    return { success: false, error: err }
  }
}