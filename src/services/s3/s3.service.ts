import {
  IS3Service,
  TAcl,
  TDeleteFileFn,
  TGenerateParamsS3,
  TGetPhotoFn,
  TUploadFileFn,
  TUploadToS3,
} from './type'
import { S3 } from 'aws-sdk'
import * as dotenv from 'dotenv'
import mime from 'mime'
import { getEnv } from '../../helpers'
dotenv.config()

class S3Service implements IS3Service {
  private s3 = new S3()
  private BUCKET_NAME = getEnv('AWS_S3_BUCKET')

  getPhoto: TGetPhotoFn = async key => {
    return await this.s3.getObject({ Bucket: this.BUCKET_NAME, Key: key }).promise()
  }

  uploadFile: TUploadFileFn = async uploadArgs => {
    const { isPrivate } = uploadArgs
    const params = this.generateParamsS3(uploadArgs)
    return await this.uploadToS3(params, isPrivate)
  }

  deleteFile: TDeleteFileFn = async key => {
    await this.s3.deleteObject({ Bucket: this.BUCKET_NAME, Key: key }).promise()
  }

  private generateParamsS3: TGenerateParamsS3 = uploadArgs => {
    const { file, fileName, rootFolder, isPrivate } = uploadArgs

    const dir = `${this.BUCKET_NAME}/${rootFolder}`
    const ACL: TAcl = isPrivate ? 'private' : 'public-read'

    const params = {
      Bucket: dir,
      Key: String(fileName),
      Body: file,
      ACL,
      ContentType: mime.getType(fileName) || '',
      ContentDisposition: 'attachment',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    }
    return params
  }

  private uploadToS3: TUploadToS3 = async (params, isPrivate) => {
    try {
      const s3Response = await this.s3.upload(params).promise()

      if (!isPrivate) return s3Response.Location

      const paramsSigned = {
        Bucket: this.BUCKET_NAME,
        Key: s3Response.Key,
        Expires: null,
      }

      const url = this.s3.getSignedUrl('getObject', paramsSigned)

      return url
    } catch (error) {
      throw error
    }
  }
}

export const s3Service = new S3Service()
