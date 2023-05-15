export const getAlbumIdFromFilePathAndExtension = (path: string) => {
  const filename = path.split('_').at(-1) || ''
  const [albumId, expansion] = filename.split('.')

  return { albumId, expansion }
}
