import { connect } from '@/config/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

connect()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    const user = await User.findOne({ email: (email as string).toLowerCase() })
    if (!user) {
      return NextResponse.json({ error: 'Email is invalid' }, { status: 400 })
    }

    if (!user.isVerified) {
      return NextResponse.json(
        {
          error: 'Please check your email and verify your account first',
        },
        { status: 400 }
      )
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    }

    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: '1d',
    })

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
    })

    response.cookies.set('token', token, {
      httpOnly: true,
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
