import { PrismaClient } from '@prisma/client'

const db = new PrismaClient({
  log: ['query', 'warn', 'info']
})

db.rule.findMany({
  where: {
    conditions: '1'
  }
})
