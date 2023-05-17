import { TNewPhotos, TPhotos } from '../../schema'

export interface IPhotosRepository {
  addPhotos: TAddPhotosFn
  getPhotosForAlbum: TGetPhotosForAlbumFn
  updateOriginalUrl: TUpdateOriginalUrlFn
}

export type TAddPhotosFn = (photoData: TNewPhotos) => Promise<void>
export type TGetPhotosForAlbumFn = () => Promise<TGetPhotosForAlbumResponse[]>
export type TUpdateOriginalUrlFn = (photoId: string, data: TUpdateOriginalUrlData) => Promise<void>

type TGetPhotosForAlbumResponse = Pick<TPhotos, 'id' | 'originalResizedUrl' | 'originalUrl'>
type TUpdateOriginalUrlData = Pick<TPhotos, 'originalResizedUrl' | 'originalUrl'>
