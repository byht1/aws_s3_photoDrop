import { S3Event } from 'aws-lambda'
// import TelegramBot from 'node-telegram-bot-api'
import { s3Service } from '../services'
import { generateFileName, getIdFromFilePathAndExtension } from '../helpers'
import { albumsRepository, photosRepository } from '../db/repository'
import { usersRepository } from '../db/repository/users/usersRepository'

// const bot = new TelegramBot('5691867490:AAFvkE7G9k_H0tyWeXJMU03GPKAJpaDxTmg', { polling: true })

export const handler = async (event: S3Event): Promise<void> => {
  const { key: pathToFile } = event.Records[0]?.s3.object
  try {
    const { Body } = await s3Service.getPhoto(pathToFile)
    const { id: userId, expansion } = getIdFromFilePathAndExtension(pathToFile)

    const buffer = Body as Buffer
    const fileName = generateFileName(expansion)()

    const selfieUrl = await s3Service.uploadFile({
      file: buffer,
      fileName,
      rootFolder: `selfie/${userId}`,
      isPrivate: false,
    })
    await usersRepository.addSelfie({ userId, url: selfieUrl })
    // await bot.sendMessage(589391825, JSON.stringify(watermarkUrl))
  } catch (error) {
    throw error
  } finally {
    await s3Service.deleteFile(pathToFile)
  }
}
