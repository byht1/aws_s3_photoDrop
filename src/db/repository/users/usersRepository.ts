import { eq } from 'drizzle-orm'
import { getDrizzle } from '../../connectDB'
import { users, usersSelfie } from '../../schema'
import { IUsersRepository, TAddAvatarFn, TAddSelfieFn } from './type'

class UsersRepository implements IUsersRepository {
  private db = getDrizzle()
  private usersSelfieTable = usersSelfie
  private table = users

  addSelfie: TAddSelfieFn = async selfie => {
    await this.db.insert(this.usersSelfieTable).values(selfie)
  }

  addAvatar: TAddAvatarFn = async (searchUserId, avatar) => {
    const { id } = this.table
    await this.db.update(this.table).set({ avatar }).where(eq(id, searchUserId))
  }
}

export const usersRepository = new UsersRepository()
