import nodemailer from 'nodemailer'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

function welcomeEmailHtml(handle: string, profileUrl: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Welcome, @${handle}! 👋</h1>

      <p>
        Your Bookmarks account is ready.
      </p>

      <a
        href="${profileUrl}"
        style="
          background:#6c47ff;
          color:white;
          padding:12px 20px;
          border-radius:8px;
          text-decoration:none;
          display:inline-block;
          margin-top:20px;
        "
      >
        View Profile
      </a>

      <p style="margin-top:24px;">
        Dashboard:
        <a href="${SITE_URL}/dashboard">
          Open Dashboard
        </a>
      </p>
    </div>
  `
}

export async function sendWelcomeEmailSMTP(
  email: string,
  handle: string
) {
  try {
    const profileUrl = `${SITE_URL}/${handle}`

    await transporter.sendMail({
      from: `"Bookmarks" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to Bookmarks, @${handle}!`,
      html: welcomeEmailHtml(handle, profileUrl),
      text: `Welcome @${handle}! Visit: ${profileUrl}`,
    })

    return { success: true }

  } catch (error) {
    console.error('[SMTP EMAIL ERROR]', error)

    return {
      success: false,
      error,
    }
  }
}