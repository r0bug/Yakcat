import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      return NextResponse.json({
        message: 'If an account exists with that email, password reset instructions have been sent.'
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // In a production app, you would send an email here
    // For now, we'll just log the reset link
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    console.log('Password reset link:', resetLink)
    console.log('Reset token:', resetToken)
    
    // TODO: Implement email sending with a service like SendGrid, Resend, or AWS SES
    // Example with a hypothetical email service:
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Password Reset Request',
    //   html: `
    //     <p>You requested a password reset.</p>
    //     <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
    //     <p>This link will expire in 1 hour.</p>
    //     <p>If you didn't request this, please ignore this email.</p>
    //   `
    // })

    return NextResponse.json({
      message: 'If an account exists with that email, password reset instructions have been sent.',
      // In development, include the token for testing
      ...(process.env.NODE_ENV === 'development' && { resetToken, resetLink })
    })
  } catch (error) {
    console.error('Error processing password reset:', error)
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}