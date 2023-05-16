import { v4 as uuidv4 } from 'uuid'

export const generateFileName = (expansion: string) => {
  return () => `${uuidv4()}.${expansion}`
}
