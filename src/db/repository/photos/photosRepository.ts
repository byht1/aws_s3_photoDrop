import { eq } from 'drizzle-orm'
import { getDrizzle } from '../../connectDB'
import { photos } from '../../schema'
import { IPhotosRepository, TGetPhotosForAlbumFn, TUpdateOriginalUrlFn, TUpdateUrlFn } from './type'

class PhotosRepository implements IPhotosRepository {
  private db = getDrizzle()
  private table = photos

  // addPhotos: TAddPhotosFn = async photoData => {
  //   await this.db.insert(this.table).values(photoData)
  // }

  updateUrl: TUpdateUrlFn = async (searchPhotoId, newUrl) => {
    const { id } = this.table
    await this.db.update(this.table).set(newUrl).where(eq(id, searchPhotoId))
  }

  getPhotosForAlbum: TGetPhotosForAlbumFn = async () => {
    const { id, originalResizedUrl, originalUrl } = this.table
    const URLs = await this.db.select({ id, originalResizedUrl, originalUrl }).from(this.table)

    return URLs
  }

  updateOriginalUrl: TUpdateOriginalUrlFn = async (searchPhotoId, newUrl) => {
    const { id } = this.table
    await this.db.update(this.table).set(newUrl).where(eq(id, searchPhotoId))
  }
}

export const photosRepository = new PhotosRepository()
