import { InferModel } from 'drizzle-orm'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export const albums = pgTable('albums', {
  id: uuid('id').defaultRandom().primaryKey(),
  owner: uuid('owner').notNull(),
  name: varchar('first_name', { length: 50 }).notNull(),
  location: varchar('location', { length: 250 }).notNull(),
  createdAt: varchar('created_at', { length: 25 }).notNull(),
})

export type TAlbums = InferModel<typeof albums>
export type TableAlbums = typeof albums
