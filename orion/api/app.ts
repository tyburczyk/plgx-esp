import { use, server, schema, settings } from 'nexus'
import { prisma } from 'nexus-plugin-prisma'
import { __DEV__ } from './environment'

// Enables the Prisma plugin
use(
  prisma({
    client: {
      options: {
        log: [__DEV__ ? 'query' : 'info']
      }
    }
  })
)

schema.addToContext(({ req }) => {
  return {
    auth: {
      token: req.headers['x-user-auth-token']
    }
  }
})

settings.change({
  server: {
    playground: {
      enabled: true
    },
    cors: true,
    port: 4000
  }
})
