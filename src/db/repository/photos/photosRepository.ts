import { getDrizzle } from '../../connectDB'
import { photos } from '../../schema'
import { IPhotosRepository, TAddPhotosFn } from './type'

class PhotosRepository implements IPhotosRepository {
  private db = getDrizzle()
  private table = photos

  addPhotos: TAddPhotosFn = async photoData => {
    await this.db.insert(this.table).values(photoData)
  }
}

export const photosRepository = new PhotosRepository()
