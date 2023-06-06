import mongoose from 'mongoose'
import app from './app'
import config from './config'
import { logger, errorLogger } from './shared/logger'
import { Server } from 'http'
let server: Server
process.on('uncaughtException', error => {
  errorLogger.error(error)
  process.exit(1)
})
async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string)
    logger.info(`Database Connected`)
    server = app.listen(config.port, () => {
      logger.info(
        `Programming Hero User Auth Server listening on port ${config.port}`
      )
    })
  } catch (err) {
    errorLogger.error('An Error Occurred', err)
  }
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error(error)
        process.exit(1)
      })
    } else {
      process.exit(1)
    }
  })
}
bootstrap()
process.on('SIGTERM', () => {
  logger.info('SIGTERM is received')
  if (server) {
    server.close()
  }
})
