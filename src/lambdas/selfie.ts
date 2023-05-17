import { S3Event } from 'aws-lambda'
import { s3Service } from '../services'
import { generateFileName, getIdFromFilePathAndExtension } from '../helpers'
import { usersRepository } from '../db/repository/users/usersRepository'

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
  } catch (error) {
    throw error
  } finally {
    await s3Service.deleteFile(pathToFile)
  }
}
