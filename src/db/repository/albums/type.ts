import { TAlbums } from '../../schema'

export interface IAlbumsRepository {
  getById: TGetByIdFn
}

export type TGetByIdFn = (id: string) => Promise<TResponseAlbumName | undefined>

type TResponseAlbumName = Pick<TAlbums, 'name'>
