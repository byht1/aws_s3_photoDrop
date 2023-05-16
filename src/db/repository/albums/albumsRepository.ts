import { eq } from 'drizzle-orm'
import { getDrizzle } from '../../connectDB'
import { IAlbumsRepository, TGetByIdFn } from './type'
import { albums } from '../../schema'

class AlbumsRepository implements IAlbumsRepository {
  private db = getDrizzle()
  private table = albums

  getById: TGetByIdFn = async searchAlbumId => {
    const { id, name } = this.table
    const album = await this.db.select({ name }).from(this.table).where(eq(id, searchAlbumId))
    return album.at(0)
  }
}

export const albumsRepository = new AlbumsRepository()
