import { S3Event } from 'aws-lambda'
// import TelegramBot from 'node-telegram-bot-api'
import { v4 as uuidv4 } from 'uuid'
import { TOriginalMetadata, photoService, s3Service } from '../services'
import { getAlbumIdFromFilePathAndExtension } from '../helpers'

// const bot = new TelegramBot('5691867490:AAFvkE7G9k_H0tyWeXJMU03GPKAJpaDxTmg', { polling: true })

export const handler = async (event: S3Event): Promise<void> => {
  const { key: pathToFile } = event.Records[0]?.s3.object
  try {
    const { Body } = await s3Service.getPhoto(pathToFile)
    const { albumId, expansion } = getAlbumIdFromFilePathAndExtension(pathToFile)
    const fileName = `${uuidv4()}.${expansion}`
    const buffer = Body as Buffer

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
      fileName: `${uuidv4()}.${expansion}`,
      rootFolder: `albums/${albumId}/original/resized`,
      isPrivate: true,
    })
    const promise3 = s3Service.uploadFile({
      file: watermark,
      fileName: `${uuidv4()}.${expansion}`,
      rootFolder: `albums/${albumId}/watermark`,
      isPrivate: false,
    })
    const promise4 = s3Service.uploadFile({
      file: watermarkResized,
      fileName: `${uuidv4()}.${expansion}`,
      rootFolder: `albums/${albumId}/watermark/resized`,
      isPrivate: false,
    })

    const [originalUrl, originalResizedUrl, watermarkUrl, watermarkResizedUrl] = await Promise.all([
      promise1,
      promise2,
      promise3,
      promise4,
    ])
    // await bot.sendMessage(589391825, JSON.stringify(watermarkUrl))
  } catch (error) {
    throw error
  } finally {
    await s3Service.deleteFile(pathToFile)
  }
}
