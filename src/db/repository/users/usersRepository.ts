import { getDrizzle } from '../../connectDB'
import { usersSelfie } from '../../schema'
import { IUsersRepository, TAddSelfieFn } from './type'

class UsersRepository implements IUsersRepository {
  private db = getDrizzle()
  private table = usersSelfie

  addSelfie: TAddSelfieFn = async selfie => {
    await this.db.insert(this.table).values(selfie)
  }
}

export const usersRepository = new UsersRepository()
