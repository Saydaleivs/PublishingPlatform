import { connect } from '@/config/dbConfig'
import { getDataFromToken } from '@/helpers/decodingToken'
import { NextRequest, NextResponse } from 'next/server'
import User from '@/models/userModel'

connect()

export async function GET(request: NextRequest) {
  try {
    const { _id } = getDataFromToken(request)

    const user = await User.findOne({ _id }).select('-password')

    return NextResponse.json({
      mesaaage: 'User found',
      user,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json()

  const { _id } = getDataFromToken(request)
  const user = await User.findOne({
    $or: [{ email: body?.email }, { username: body?.username }],
    _id: { $not: { $eq: _id } },
  })

  if (user) {
    return NextResponse.json(
      {
        mesaaage: 'Username or email already exists',
      },
      { status: 400 }
    )
  }

  const updatedUser = await User.updateOne({ _id }, body)

  return NextResponse.json({
    message: 'Updated successfully',
    updatedUser,
  })
}
