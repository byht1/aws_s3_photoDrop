import sharp from 'sharp'
import {
  IPhotoService,
  TAdjustWatermarkToImageFn,
  TApplyWatermarkFn,
  TProcessAndGeneratePhotoVariantsFn,
  TResizePhotoFn,
} from './type'
import { join as pathJoin } from 'path'

class PhotoService implements IPhotoService {
  private WATERMARK_SIZE = 0.9
  private watermarkPhoto = pathJoin(__dirname, '../../../watermarkPhotoDrop.png')
  private watermarkPhotoMin = pathJoin(__dirname, '../../../watermarkPhotoDropMin.png')

  processAndGeneratePhotoVariants: TProcessAndGeneratePhotoVariantsFn = async originalFile => {
    const watermarkIconPromise = this.adjustWatermarkToImage(originalFile)
    const originalResizedPromise = this.resizePhoto(originalFile)
    const watermarkPhotoMinPromise = sharp(this.watermarkPhotoMin).toBuffer()

    const [watermarkIcon, originalResized, watermarkPhotoMin] = await Promise.all([
      watermarkIconPromise,
      originalResizedPromise,
      watermarkPhotoMinPromise,
    ])

    const watermarksOriginalSizePromise = this.applyWatermark(originalFile, watermarkIcon)
    const watermarksResizedPromise = this.applyWatermark(originalResized, watermarkPhotoMin)

    const [watermarksOriginalSize, watermarksResized] = await Promise.all([
      watermarksOriginalSizePromise,
      watermarksResizedPromise,
    ])

    return {
      original: originalFile,
      originalResized,
      watermark: watermarksOriginalSize,
      watermarkResized: watermarksResized,
    }
  }

  private resizePhoto: TResizePhotoFn = async file => {
    const newFile = await sharp(file).resize(400, 400)
    return newFile.toBuffer()
  }

  private applyWatermark: TApplyWatermarkFn = async (file, watermark) => {
    const newFile = await sharp(file)
      .composite([
        {
          input: watermark,
          gravity: 'center',
        },
      ])
      .toBuffer()

    return newFile
  }

  private adjustWatermarkToImage: TAdjustWatermarkToImageFn = async originalFile => {
    // Отримуємо розміри оригінального зображення
    const { width: originalWidth, height: originalHeight } = await this.getFileMetadata(
      originalFile
    )

    // Отримуємо розміри водяного знаку
    const { width: watermarkWidth, height: watermarkHeight } = await this.getFileMetadata(
      this.watermarkPhoto
    )

    // Обчислюємо розміри водяного знаку з урахуванням пропорцій
    const ratio = Math.min(
      (originalWidth / watermarkWidth) * this.WATERMARK_SIZE,
      (originalHeight / watermarkHeight) * this.WATERMARK_SIZE
    )
    const scaledWidth = Math.round(watermarkWidth * ratio)
    const scaledHeight = Math.round(watermarkHeight * ratio)

    // Масштабуємо водяний знак до відповідних розмірів
    const scaledWatermark = await sharp(this.watermarkPhoto)
      .resize(scaledWidth, scaledHeight)
      .toBuffer()

    return scaledWatermark
  }

  private getFileMetadata = async (pathToFile: string | Buffer) => {
    const { width = 0, height = 0 } = await sharp(pathToFile).metadata()

    return { width, height }
  }
}

export const photoService = new PhotoService()
