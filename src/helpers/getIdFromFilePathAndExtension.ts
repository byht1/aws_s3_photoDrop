export const getIdFromFilePathAndExtension = (path: string) => {
  const filename = path.split('/').at(-1) || ''
  const [number, idAndExpansion] = filename.split('_') || ''
  const [id, expansion] = idAndExpansion.split('.')

  return { id, expansion, number }
}
