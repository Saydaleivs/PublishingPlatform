import User from '@/models/userModel'
import { connect } from '@/config/dbConfig'
import { NextRequest, NextResponse } from 'next/server'

connect()

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get('username')?.toLowerCase()

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required is params' },
        { status: 400 }
      )
    }

    // const user = await User.aggregate([{ $match: { username: 'Saeedbek' } }])
    const user = await User.findOne({ username })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'User found', user })
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}
