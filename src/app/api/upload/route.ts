import { connect, fileExists } from '@/config/dbConfig'
import { NextResponse } from 'next/server'
import { Readable } from 'stream'
import crypto from 'crypto'

export async function POST(req: Request) {
  const { bucket } = await connect()
  const data = await req.formData()

  for (const entry of Array.from(data.entries())) {
    const [key, value] = entry
    const isFile = typeof value == 'object'
    if (!isFile) return 'Not file'

    const blob = value as Blob
    let filename = ''

    crypto.randomBytes(16, async (err, buf) => {
      filename = buf.toString('hex') + blob.name
    })

    const buffer = Buffer.from(await blob.arrayBuffer())
    const stream = Readable.from(buffer)

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: blob.type,
      metadata: {},
    })

    await stream.pipe(uploadStream)

    return NextResponse.json({ success: true, filename })
  }
}
