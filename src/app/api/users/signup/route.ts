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
      $or: [{ email }, { username }],
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

    await sendEmail(email, 'VERIFY', savedUser._id.toString())

    const response = NextResponse.json({
      message: 'User created successfully',
      status: 201,
      token,
    })

    response.cookies.set('token', token, {
      httpOnly: true,
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
