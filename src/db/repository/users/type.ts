import { TNewUsersSelfie } from '../../schema'

export interface IUsersRepository {
  addSelfie: TAddSelfieFn
}

export type TAddSelfieFn = (selfie: TNewUsersSelfie) => Promise<void>
