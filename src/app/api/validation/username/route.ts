import { getDataFromToken } from '@/helpers/decodingToken'
import User from '@/models/userModel'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { _id } = getDataFromToken(request)
    const username = request.nextUrl.searchParams.get('username')

    const user = await User.findOne({
      username: username,
      _id: { $not: { $eq: _id } },
    })

    if (user) {
      return NextResponse.json({
        message: 'Username is already used',
        status: 400,
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
