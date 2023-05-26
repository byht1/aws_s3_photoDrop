export const decodePhotoName = (path: string) => {
  const regex = /(\d+)_(\w+-\w+-\w+-\w+-\w+)_([\w-]+)(\.\w+)$/
  const match = path.match(regex) as RegExpMatchArray

  return {
    number: match[1],
    albumId: match[2],
    photoId: match[3],
    expansion: match[4],
  }
}

export const decodeSelfieName = (path: string) => {
  const [filename] = path.split('/').reverse()
  const [userId, expansion] = filename.split('.')
  return { userId, expansion }
}
