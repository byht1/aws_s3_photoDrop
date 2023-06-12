export interface IPhotoService {
  processAndGeneratePhotoVariants: TProcessAndGeneratePhotoVariantsFn
}

export type TProcessAndGeneratePhotoVariantsFn = (originalFile: Buffer) => Promise<TFileResponse>
export type TApplyWatermarkFn = (file: Buffer, watermark: Buffer) => Promise<Buffer>
export type TResizePhotoFn = (file: Buffer) => Promise<Buffer>
export type TAdjustWatermarkToImageFn = (originalFile: Buffer) => Promise<Buffer>

export type TOriginalMetadata = {
  originalWidth: number
  originalHeight: number
}
type TFileResponse = {
  watermark: Buffer
  watermarkResized: Buffer
  originalResized: Buffer
  original: Buffer
}
