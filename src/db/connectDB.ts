import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { getEnv } from '../helpers'

const connect = () => {
  const pool = new Pool({
    connectionString: getEnv('DB_URL'),
    ssl: true,
  })

  return drizzle(pool)
}

class DrizzleConnect {
  private drizzle = connect()
  private static instance: DrizzleConnect

  constructor() {
    if (DrizzleConnect.instance) {
      return DrizzleConnect.instance
    }
    DrizzleConnect.instance = this
  }

  getDrizzle = () => this.drizzle
}

export const { getDrizzle } = new DrizzleConnect()
