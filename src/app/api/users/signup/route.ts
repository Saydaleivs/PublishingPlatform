import { connect } from '@/config/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { sendEmail } from '@/helpers/sendEmail'

connect()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, username, email, password } = body

    const user = await User.findOne({
      $or: [
        { email: (email as string).toLowerCase() },
        { username: (username as string).toLowerCase() },
      ],
    })

    if (user) {
      return NextResponse.json(
        { error: 'User is already exist' },
        { status: 400 }
      )
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullName,
      username: (username as string).toLowerCase(),
      email: (email as string).toLowerCase(),
      password: hashedPassword,
    })

    const savedUser = await newUser.save()

    const tokenData = {
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
    }

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: '1d',
    })

    await sendEmail(email, 'VERIFY', savedUser._id.toString(), token)

    return NextResponse.json({
      message:
        'Profile created successfully, now please checkout your email and verify',
      status: 201,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
