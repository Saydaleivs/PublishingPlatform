import { MongoClient, GridFSBucket } from 'mongodb'
import mongoose from 'mongoose'

declare global {
  var client: MongoClient | null
  var bucket: GridFSBucket | null
}

const MONGO_URI = process.env.MONGO_URI
if (!MONGO_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

export async function fileExists(filename: string): Promise<boolean> {
  const { client } = await connect()

  const count = await client!
    .db()
    .collection('images.files')
    .countDocuments({ filename })

  return !!count
}

export async function connect() {
  if (global.client) {
    return {
      client: global.client,
      bucket: global.bucket!,
    }
  }

  const client = (global.client = new MongoClient(MONGO_URI!, {}))
  const bucket = (global.bucket = new GridFSBucket(client.db(), {
    bucketName: 'images',
  }))

  mongoose.connect(MONGO_URI!)
  const connection = mongoose.connection

  connection.on('connected', async () => {
    await global.client!.connect()
    console.log('Connected to MongoDB')
  })

  connection.on('error', (err) => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    )
    process.exit()
  })

  return { client, bucket: bucket! }
}
