import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendContactEmail(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  if (!resend || !process.env.RESEND_API_KEY) {
    console.log('[Email] Resend not configured. Would send contact email from:', email, subject)
    return { success: true, data: { id: 'demo-' + Date.now() } }
  }

  try {
    const result = await resend.emails.send({
      from: 'EmoSense <noreply@emosense.dev>',
      to: 'support@emosense.dev',
      replyTo: email,
      subject: `Contact Form: ${subject} from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <h3>Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This email was sent via the EmoSense contact form.
          </p>
        </div>
      `,
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      return { success: false, error: 'Failed to send email' }
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: 'An error occurred while sending the email' }
  }
}

export async function sendWellnessNotification(
  userEmail: string,
  userName: string,
  type: 'wellness_tip' | 'mood_reminder' | 'achievement_unlocked'
) {
  if (!resend || !process.env.RESEND_API_KEY) {
    console.log('[Email] Resend not configured. Would send wellness notification to:', userEmail, 'type:', type)
    return { success: true, data: { id: 'demo-' + Date.now() } }
  }

  const templates: Record<string, { subject: string; html: string }> = {
    wellness_tip: {
      subject: 'Your Daily Wellness Tip from EmoSense',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${userName}!</h2>
          <p>Here's a wellness tip to brighten your day:</p>
          <div style="background: linear-gradient(135deg, #7C6FCD 0%, #F9A8D4 100%); padding: 30px; border-radius: 12px; color: white; margin: 20px 0;">
            <p style="font-size: 16px; margin: 0;">Take 5 minutes for a breathing exercise. Try the 4-7-8 technique: Breathe in for 4 counts, hold for 7, exhale for 8.</p>
          </div>
          <p>Keep taking care of yourself!</p>
          <p>— The EmoSense Team</p>
        </div>
      `,
    },
    mood_reminder: {
      subject: 'Time to Check In With Your Emotions',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hi ${userName}!</h2>
          <p>It's time for your daily emotional check-in. How are you feeling today?</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p><a href="https://emosense.dev/emotion-detection" style="display: inline-block; background-color: #7C6FCD; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold;">Check Your Emotion</a></p>
          </div>
          <p>Understanding your emotions helps you manage them better.</p>
          <p>— The EmoSense Team</p>
        </div>
      `,
    },
    achievement_unlocked: {
      subject: '🎉 Achievement Unlocked!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>🎉 Congratulations, ${userName}!</h2>
          <p>You've unlocked a new achievement on EmoSense!</p>
          <div style="background: linear-gradient(135deg, #86EFAC 0%, #7C6FCD 100%); padding: 30px; border-radius: 12px; color: white; margin: 20px 0;">
            <p style="font-size: 18px; margin: 0;">✨ You're on a wellness streak!</p>
          </div>
          <p>Keep it up and discover more achievements!</p>
          <p>— The EmoSense Team</p>
        </div>
      `,
    },
  }

  const template = templates[type]
  if (!template) {
    return { success: false, error: 'Unknown notification type' }
  }

  try {
    const result = await resend.emails.send({
      from: 'EmoSense <noreply@emosense.dev>',
      to: userEmail,
      subject: template.subject,
      html: template.html,
    })

    if (result.error) {
      console.error('Resend error:', result.error)
      return { success: false, error: 'Failed to send notification' }
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error('Notification sending error:', error)
    return { success: false, error: 'An error occurred while sending the notification' }
  }
}
