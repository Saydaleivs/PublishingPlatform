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
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROaHFA3JbJGxEbsw6t1xui2bzVIqNtAUGTnS29jnBUWQ&s',
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
