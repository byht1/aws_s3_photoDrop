import { InferModel } from 'drizzle-orm'
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { albums } from './albums.schema'

const defaultUrl = 'https://photo-drop-lambda.s3.eu-central-1.amazonaws.com/logo.jpg'

export const photos = pgTable('photos', {
  id: uuid('id').defaultRandom().primaryKey(),
  albumId: uuid('album_id')
    .notNull()
    .references(() => albums.id),
  name: varchar('name', { length: 50 }),
  people: varchar('people').array().default([]),
  originalResizedUrl: varchar('original_resized_url').notNull().default(defaultUrl),
  watermarkResizedUrl: varchar('watermark_resized_url').notNull().default(defaultUrl),
  originalUrl: varchar('original_url').notNull().default(defaultUrl),
  watermarkUrl: varchar('watermark_url').notNull().default(defaultUrl),
})
export type TPhotos = InferModel<typeof photos>
export type TNewPhotos = InferModel<typeof photos, 'insert'>
export type TablePhotos = typeof photos
