import { Handler } from 'aws-lambda'
import { photosRepository } from '../db/repository'
import { s3Service } from '../services'
import { generateS3Key } from '../helpers'

export const handler: Handler = async () => {
  const photos = await photosRepository.getPhotosForAlbum()

  const updatePromise = photos.map(async ({ id, originalResizedUrl, originalUrl }) => {
    const keyOriginalResizedUrl = generateS3Key(originalResizedUrl)
    const keyOriginalUrl = generateS3Key(originalUrl)

    const newUrlOriginalResizedUrl = await s3Service.getNewUrlToPhoto(keyOriginalResizedUrl)
    const newUrlOriginalUrl = await s3Service.getNewUrlToPhoto(keyOriginalUrl)

    const updateUrl = {
      originalResizedUrl: newUrlOriginalResizedUrl,
      originalUrl: newUrlOriginalUrl,
    }

    await photosRepository.updateOriginalUrl(id, updateUrl)
  })

  await Promise.all(updatePromise)
}
