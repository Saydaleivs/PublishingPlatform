import { Readable } from 'stream'
import { connect } from './dbConfig'

export class GridFSUtils {
  static async fileExists(filename: string): Promise<boolean> {
    const { client } = await connect()
    const count = await client
      .db()
      .collection('images.files')
      .countDocuments({ filename })

    return !!count
  }
}
