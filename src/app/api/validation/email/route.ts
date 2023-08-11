import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connect } from '@/config/dbConfig'

connect()

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || null
    const email = request.nextUrl.searchParams.get('email')?.toLowerCase()

    let user
    if (token) {
      const { id }: any = jwt.verify(token, process.env.TOKEN_SECRET!)
      user = await User.findOne({
        email,
        _id: { $not: { $eq: id } },
      })
    } else {
      user = await User.findOne({
        email,
      })
    }

    if (user) {
      return NextResponse.json({
        message: 'Email is already used',
        status: 400,
      })
    }

    return NextResponse.json({
      message: 'Email can be used',
      status: 200,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
