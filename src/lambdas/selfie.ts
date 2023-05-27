import { S3Event } from 'aws-lambda'
import { s3Service } from '../services'
import { generateFileName, decodeSelfieName } from '../helpers'
import { usersRepository } from '../db/repository/users/usersRepository'

export const handler = async (event: S3Event): Promise<void> => {
  const { key: pathToFile } = event.Records[0]?.s3.object
  try {
    const { Body } = await s3Service.getPhoto(pathToFile)
    const { userId, expansion } = decodeSelfieName(pathToFile)

    const buffer = Body as Buffer
    const fileName = generateFileName(expansion)()

    const selfieUrl = await s3Service.uploadFile({
      file: buffer,
      fileName,
      rootFolder: `selfie/${userId}`,
      isPrivate: false,
    })

    await Promise.all([
      usersRepository.addSelfie({ userId, url: selfieUrl }),
      usersRepository.addAvatar(userId, selfieUrl),
    ])
  } catch (error) {
    throw error
  } finally {
    await s3Service.deleteFile(pathToFile)
  }
}
