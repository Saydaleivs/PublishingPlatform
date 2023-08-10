import { Resend } from 'resend'
import User from '@/models/userModel'
import bcrypt from 'bcrypt'

const resend = new Resend(process.env.RESEND_TOKEN)

export const sendEmail = async (email, emailType, userId, jwtToken) => {
  const hashedToken = await bcrypt.hash(userId, 10)

  if (emailType === 'VERIFY') {
    await User.findByIdAndUpdate(userId, {
      verifyToken: hashedToken,
      verifyTokenExpiry: Date.now() + 3600000,
    })
  }

  if (emailType === 'FORGET_PASSWORD') {
    await User.findByIdAndUpdate(userId, {
      forgotPasswordToken: hashedToken,
      forgotPasswordTokenExpiry: Date.now() + 3600000,
    })
  }

  const url = (() => {
    if (emailType === 'VERIFY') {
      return (
        process.env.DOMAIN +
        '/api/verifyemail?token=' +
        hashedToken +
        '&tokenjwt=' +
        jwtToken
      )
    }
    if (emailType === 'FORGET_PASSWORD') {
      return process.env.DOMAIN + '/forgetPassword?token=' + hashedToken
    }
  })()

  const subject = (() => {
    if (emailType === 'VERIFY') {
      return 'Email verification'
    }
    if (emailType === 'FORGET_PASSWORD') {
      return 'Reset password'
    }
  })()

  const html = (() => {
    if (emailType === 'VERIFY') {
      return `<h3>Hi! Please verify your account by clicking this button</h3> <br /> 
      <span><a href="${url}" style="padding:15px 25px; background-color:#0087D1; color:#ffffff; border-radius:3px; text-decoration:none;">Verify Email</a></span>`
    }

    if (emailType === 'FORGET_PASSWORD') {
      return `<h3>Please reset your password by clicking this button</h3> <br />
      <span><a href="${url}" style="padding:15px 25px; background-color:#0087D1; color:#ffffff; border-radius:3px; text-decoration:none;">Reset Password</a></span>`
    }
  })()

  await resend.emails.send({
    from: 'mail@saeed.uz',
    to: email,
    subject,
    html,
  })

  return hashedToken
}
