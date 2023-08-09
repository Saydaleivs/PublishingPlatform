import { connect } from '@/config/dbConfig'
import { sendEmail } from '@/helpers/sendEmail'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'

connect()

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    })

    if (!user) {
      return NextResponse.json({ message: 'Invalid token', success: false })
    }

    user.isVerified = true
    user.verifyToken = undefined
    user.verifyTokenExpiry = undefined
    await user.save()

    return NextResponse.json({ message: 'Email verified' })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  await sendEmail('saeedbek1111@gmail.com', 'SEND_EMAIL', '123')
  return NextResponse.json(
    { message: 'Email sent successfully' },
    { status: 200 }
  )
}
