import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { logger, errorLogger } from './shared/logger';
import { Server } from 'http';
import { RedisClient } from './shared/redis';
import subscribeToEvents from './events';
let server: Server;
process.on('uncaughtException', (error) => {
  errorLogger.error(error);
  process.exit(1);
});
// process.on('SIGTERM', () => {
//   logger.info('SIGTERM is received')
//   if (server) {
//     server.close()
//   }
// })
async function bootstrap() {
  try {
    await RedisClient.connect().then(() => {
      subscribeToEvents();
    });
    // const uri: string = config.database_url as string;

    await mongoose.connect(
      'mongodb+srv://alfatjahan:iuBx2kDXcEFNGGwB@cluster0.xh8qo9f.mongodb.net/university-management?retryWrites=true&w=majority'
    );
    logger.info(`Database Connected Here`);
    server = app.listen(config.port, () => {
      logger.info(`University Management Auth Server listening on port ${config.port}`);
    });
  } catch (err) {
    errorLogger.error('An Error Occurred', err);
  }
  process.on('unhandledRejection', (error) => {
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}
bootstrap();
