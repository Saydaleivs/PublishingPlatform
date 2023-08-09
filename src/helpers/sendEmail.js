import User from '@/models/userModel'
import bcrypt from 'bcrypt'

const ElasticEmail = require('@elasticemail/elasticemail-client')
const client = ElasticEmail.ApiClient.instance
const apikey = client.authentications['apikey']
apikey.apiKey = process.env.ELASTICMAIL_TOKEN

const emailsApi = new ElasticEmail.EmailsApi()

export const sendEmail = async (email, emailType, userId) => {
  const hashedToken = await bcrypt.hash(userId, 10)
  if (emailType === 'VERIFY') {
    await User.findByIdAndUpdate(userId, {
      verifyToken: hashedToken,
      verifyTokenExpiry: Date.now() + 3600000,
    })
  }

  const emailData = {
    Recipients: [
      {
        Email: email,
        Fields: {
          tokenURL:
            process.env.DOMAIN + '/api/verifyemail?token=' + hashedToken,
        },
      },
    ],
    Content: {
      Body: [
        {
          ContentType: 'HTML',
          Charset: 'utf-8',
          Content:
            'Hi! Verify token by clicking the <a href="{tokenURL}">Link</a>',
        },
        {
          ContentType: 'PlainText',
          Charset: 'utf-8',
          Content:
            'Hi! Verify token by clicking the <a href="{tokenURL}">Link</a>',
        },
      ],
      From: 'mail@saeed.uz',
      Subject: 'Email verification',
    },
  }

  const callback = (error, data, response) => {
    if (error) {
      console.error(error)
    } else {
      console.log('API called successfully.')
      console.log('Email sent.')
    }
  }

  emailsApi.emailsPost(emailData, callback)
}
