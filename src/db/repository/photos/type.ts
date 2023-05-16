import { TNewPhotos } from '../../schema'

export interface IPhotosRepository {
  addPhotos: TAddPhotosFn
}

export type TAddPhotosFn = (photoData: TNewPhotos) => Promise<void>
