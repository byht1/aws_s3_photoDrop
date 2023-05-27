import { TNewUsersSelfie } from '../../schema'

export interface IUsersRepository {
  addSelfie: TAddSelfieFn
  addAvatar: TAddAvatarFn
}

export type TAddSelfieFn = (selfie: TNewUsersSelfie) => Promise<void>
export type TAddAvatarFn = (userId: string, avatar: string) => Promise<void>
