import * as dotenv from 'dotenv'
dotenv.config()

type TEnvKey = 'DB_URL' | 'AWS_S3_BUCKET'

export const getEnv = (envKey: TEnvKey, defaultValue = '') => {
  const value = process.env[envKey]
  const response = value ? value : defaultValue

  return response
}
