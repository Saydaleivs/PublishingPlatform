import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { sendEmail } from '@/helpers/sendEmail'
import { connect } from '@/config/dbConfig'

connect()

export async function GET(request: NextRequest) {
  try {
    const fpToken = request.nextUrl.searchParams.get('token')!

    if (fpToken.length > 0) {
      const user = await User.findOne({
        forgotPasswordToken: fpToken,
        forgotPasswordTokenExpiry: { $gt: Date.now() },
      })

      if (!user) {
        return NextResponse.json(
          { message: 'Token is invalid' },
          { status: 400 }
        )
      }

      return NextResponse.json({ message: 'Token is valid' }, { status: 200 })
    }

    const email = request.nextUrl.searchParams.get('email')
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { message: 'User with this email not found' },
        { status: 404 }
      )
    }

    const token = await sendEmail(
      email,
      'FORGET_PASSWORD',
      (user._id as string).toString()
    )

    return NextResponse.json(
      {
        message: 'Password reset sent to email successfully',
        token,
      },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const newPassword = request.nextUrl.searchParams.get('newPassword')

  if (!newPassword || !token) {
    return NextResponse.json(
      { message: 'Request is not valid' },
      { status: 400 }
    )
  }

  const user = await User.findOne({
    forgotPasswordToken: token,
    forgotPasswordTokenExpiry: { $gt: Date.now() },
  })

  if (!user) {
    return new NextResponse(`<h1>Invalid token</h1>`, {
      status: 400,
      headers: { 'content-type': 'text/html' },
    })
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  user.password = hashedPassword
  user.forgotPasswordToken = undefined
  user.forgotPasswordTokenExpiry = undefined
  await user.save()

  return NextResponse.json(
    { message: 'Password changed successfully' },
    { status: 200 }
  )
}
