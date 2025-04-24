import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { afterAll, beforeAll } from 'vitest'
import os from 'os'

let prisma: PrismaClient

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const schemaId = randomUUID()
const databaseUrl = generateUniqueDatabaseURL(schemaId)
process.env.DATABASE_URL = databaseUrl

beforeAll(async () => {
  try {
    if (os.platform() === 'win32') {
      execSync(`set DATABASE_URL=${databaseUrl} && npx prisma migrate deploy`, {
        stdio: 'inherit',
        shell: 'cmd.exe',
      })
    } else {
      execSync(`DATABASE_URL=${databaseUrl} npx prisma migrate deploy`, {
        stdio: 'inherit',
        shell: os.platform() === 'win32' ? 'cmd.exe' : '/bin/sh',
      })
    }
  } catch (error) {
    console.error('❌ Erro ao rodar migrações no banco de testes:', error)
    throw error
  }

  prisma = new PrismaClient()
})

afterAll(async () => {
  try {
    if (prisma) {
      await prisma.$executeRawUnsafe(
        `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`,
      )
      await prisma.$disconnect()
    }
  } catch (error) {
    console.error('❌ Erro ao remover schema de testes:', error)
  }
})
