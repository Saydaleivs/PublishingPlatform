import { Resend } from 'resend'
import User from '@/models/userModel'
import bcrypt from 'bcrypt'

const resend = new Resend('re_KKZRPfbw_E2tAHjwPmy4gMHEp5t5ZiSRs')

export const sendEmail = async (email, emailType, userId) => {
  const hashedToken = await bcrypt.hash(userId, 10)
  if (emailType === 'VERIFY') {
    await User.findByIdAndUpdate(userId, {
      verifyToken: hashedToken,
      verifyTokenExpiry: Date.now() + 3600000,
    })
  }

  const tokenURL = process.env.DOMAIN + '/api/verifyemail?token=' + hashedToken
  const html = `<h3>Hi! Please verify your account by clicking this button</h3> <br /> 
  <span><a href="${tokenURL}" style="padding:15px 25px; background-color:#0087D1; color:#ffffff; border-radius:3px; text-decoration:none;">Verify Email</a></span>`

  resend.emails.send({
    from: 'mail@saeed.uz',
    to: email,
    subject: 'Email verification',
    html,
  })
}
