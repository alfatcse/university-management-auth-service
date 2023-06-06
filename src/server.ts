import mongoose from 'mongoose'
import app from './app'
import config from './config'
import { logger, errorLogger } from './shared/logger'

async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string)
    logger.info(`Database Connected`)
    app.listen(config.port, () => {
      logger.info(
        `Programming Hero User Auth Server listening on port ${config.port}`
      )
    })
  } catch (err) {
    errorLogger.error('An Error Occurred', err)
  }
}
bootstrap()
