import { getDataFromToken } from '@/helpers/decodingToken'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { _id } = getDataFromToken(request)
    const email = request.nextUrl.searchParams.get('email')

    const user = await User.findOne({
      email,
      _id: { $not: { $eq: _id } },
    })

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
