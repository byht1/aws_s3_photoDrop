import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { InferModel } from 'drizzle-orm'

export const usersSelfie = pgTable('users_selfie', {
  userId: uuid('user_id').notNull(),
  url: varchar('url').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type TUsersSelfie = InferModel<typeof usersSelfie>
export type TNewUsersSelfie = InferModel<typeof usersSelfie, 'insert'>
