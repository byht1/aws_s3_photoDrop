import { AWSError, S3 } from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request'

export interface IS3Service {
  getPhoto: TGetPhotoFn
  uploadFile: TUploadFileFn
  deleteFile: TDeleteFileFn
}

export type TGetPhotoFn = (key: string) => Promise<PromiseResult<S3.GetObjectOutput, AWSError>>
export type TUploadFileFn = (params: TUploadFileFnArgument) => Promise<string>
export type TDeleteFileFn = (key: string) => Promise<void>
export type TGenerateParamsS3 = (params: TUploadFileFnArgument) => S3.PutObjectRequest
export type TUploadToS3 = (params: S3.PutObjectRequest, isPrivate: boolean) => Promise<string>

/**
 * Аргументи функції TUploadFileFnArgument для завантаження файлу.
 *
 * @template file - Файл, який потрібно завантажити. Може бути типу Buffer або S3.Body.
 * @template fileName - Ім'я файлу.
 * @template rootFolder - Шлях до файлу на Amazon S3.
 * @template isPrivate - Ознака приватності файла. Якщо true, файл буде приватним, інакше - публічним.
 */
type TUploadFileFnArgument = {
  file: Buffer | S3.Body
  fileName: string
  rootFolder: string
  isPrivate: boolean
}

export type TAcl = 'private' | 'public-read'
