import { S3Event } from 'aws-lambda'
import { photoService, s3Service } from '../services'
import { decodePhotoName } from '../helpers'
import { albumsRepository, photosRepository } from '../db/repository'

export const handler = async (event: S3Event): Promise<void> => {
  const { key: pathToFile } = event.Records[0]?.s3.object
  try {
    const { Body } = await s3Service.getPhoto(pathToFile)
    const { albumId, expansion, photoId, number: numberPhoto } = decodePhotoName(pathToFile)

    const album = await albumsRepository.getById(albumId)
    if (!album) throw new Error()
    const { name: albumName } = album

    const buffer = Body as Buffer
    const fileName = photoId + expansion

    const { original, originalResized, watermark, watermarkResized } =
      await photoService.processAndGeneratePhotoVariants(buffer)

    const promise1 = s3Service.uploadFile({
      file: original,
      fileName,
      rootFolder: `albums/${albumId}/original`,
      isPrivate: true,
    })
    const promise2 = s3Service.uploadFile({
      file: originalResized,
      fileName,
      rootFolder: `albums/${albumId}/original/resized`,
      isPrivate: true,
    })
    const promise3 = s3Service.uploadFile({
      file: watermark,
      fileName,
      rootFolder: `albums/${albumId}/watermark`,
      isPrivate: false,
    })
    const promise4 = s3Service.uploadFile({
      file: watermarkResized,
      fileName,
      rootFolder: `albums/${albumId}/watermark/resized`,
      isPrivate: false,
    })

    const [originalUrl, originalResizedUrl, watermarkUrl, watermarkResizedUrl] = await Promise.all([
      promise1,
      promise2,
      promise3,
      promise4,
    ])

    const photoData = {
      name: `${albumName} photo № ${numberPhoto}`,
      originalUrl,
      originalResizedUrl,
      watermarkUrl,
      watermarkResizedUrl,
    }

    await photosRepository.updateUrl(photoId, photoData)
  } catch (error) {
    throw error
  } finally {
    await s3Service.deleteFile(pathToFile)
  }
}
