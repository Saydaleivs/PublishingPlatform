import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { connect } from '@/config/dbConfig'

connect()

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || null
    const username = request.nextUrl.searchParams.get('username')?.toLowerCase()

    let user
    if (token) {
      const { id }: any = jwt.verify(token, process.env.TOKEN_SECRET!)
      user = await User.findOne({
        username,
        _id: { $not: { $eq: id } },
      })
    } else {
      user = await User.findOne({
        username,
      })
    }

    if (user) {
      return NextResponse.json({
        message: 'Username is already used',
        status: 400,
        user,
      })
    }

    return NextResponse.json({
      message: 'Username can be used',
      status: 200,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
