import { MailtrapClient } from 'mailtrap'
import bcrypt from 'bcrypt'
import User from '@/models/userModel'

const TOKEN = process.env.MAILTRAP_TOKEN!
const ENDPOINT = 'https://send.api.mailtrap.io/'

const sendEmail = async (email: string, emailType: string, userId: string) => {
  try {
    const hashedToken = await bcrypt.hash(userId, 10)
    if (emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      })
    }

    const mailtrapclient = new MailtrapClient({
      endpoint: ENDPOINT,
      token: TOKEN,
    })

    const sender = {
      email: 'mailtrap@saeed.uz',
      name: 'Mailtrap Test',
    }

    const recipients = [
      {
        email,
      },
    ]

    mailtrapclient
      .send({
        from: sender,
        to: recipients,
        subject: 'Verify your email',
        html: `<p>Verify your token <a href='${process.env.DOMAIN}/api/verifyemail?token=${hashedToken}'>here</a></p>`,
        category: 'VERIFY',
      })
      .then(console.log, console.error)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

// import nodemailer from 'nodemailer'

// export const sendEmail = async (
//   email: string,
//   emailType: string,
//   userId: string
// ) => {
//   try {
//     const hashedToken = await bcrypt.hash(userId, 10)

//     if (emailType === 'VERIFY') {
//       await User.findByIdAndUpdate(userId, {
//         verifyToken: hashedToken,
//         verifyTokenExpiry: Date.now() + 3600000,
//       })
//     }

//     const transport = nodemailer.createTransport({
//       host: 'sandbox.smtp.mailtrap.io',
//       port: 2525,
//       auth: {
//         user: 'c6370894dc4c5c',
//         pass: '93b54ca1251c0a',
//       },
//     })

//     const mailOptions = {
//       from: 'c6370894dc4c5c',
//       to: 'saydaleiv@gmail.com',
//       subject: 'Verify your password',
//       html: `<p>Verify your token <a href='${process.env.DOMAIN}/api/verifyemail?token=${hashedToken}'>here</a></p>`,
//     }

//     return await transport.sendMail(mailOptions)
//   } catch (error: any) {
//     throw new Error(error.message)
//   }
// }
