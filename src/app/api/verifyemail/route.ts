import { connect } from '@/config/dbConfig'
import { sendEmail } from '@/helpers/sendEmail'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'

connect()

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')
    const tokenjwt = request.nextUrl.searchParams.get('tokenjwt')!

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      // return NextResponse.json({ message: 'Invalid token', success: false })
      return new NextResponse(
        `<h1>Email verified !</h1><span><a href="${process.env.DOMAIN}" style="padding:15px 25px; background-color:#0087D1; color:#ffffff; border-radius:3px; text-decoration:none;">Go back to app</a></span>`,
        {
          status: 410,
          headers: { 'content-type': 'text/html' },
        }
      )
    }

    user.isVerified = true
    user.verifyToken = undefined
    user.verifyTokenExpiry = undefined
    await user.save()

    const response = new NextResponse(
      `<h1>Email verified !</h1><a href="${process.env.DOMAIN}">Go back to app</a>`,
      {
        status: 410,
        headers: { 'content-type': 'text/html' },
      }
    )

    response.cookies.set('token', tokenjwt, {
      httpOnly: true,
    })

    return response
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
