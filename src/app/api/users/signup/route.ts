import { connect } from '@/config/dbConfig'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

connect()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, username, email, password } = body

    const user = await User.findOne({ email })
    if (user) {
      return NextResponse.json(
        { error: 'User is already exist' },
        { status: 400 }
      )
    }

    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash(password, salt)

    const newUser = new User({
      username,
      email,
      fullName,
      password: hashedPassword,
      address: '',
      imageUrl:
        process.env.PICS_URL +
        '8d721e18f6754c9732c30c4f66a3bee2illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg',
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
