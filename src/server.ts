/* eslint-disable import/first */
import dotenv from 'dotenv';
import app from './app';
import SafeMongooseConnection from './lib/safe-mongoose-connection';
import logger from './logger';

dotenv.config();
const PORT = process.env.PORT || 3000;

const safeMongooseConnection = new SafeMongooseConnection({
  mongoUrl: process.env.MONGO_URL,
  onStartConnection: mongoUrl => logger.info(`Connecting to MongoDB at ${mongoUrl}`),
  onConnectionError: (error, mongoUrl) => logger.log({
    level: 'error',
    message: `Could not connect to MongoDB at ${mongoUrl}`,
    error
  }),
  onConnectionRetry: mongoUrl => logger.info(`Retrying to MongoDB at ${mongoUrl}`)
});
 

const serve = () => app.listen(PORT, () => {
  logger.info(`🌏 Express server started at http://localhost:${PORT}`);

  if (process.env.NODE_ENV === 'development') {
    // This route is only present in development mode
    logger.info(`⚙️  Swagger UI hosted at http://localhost:${PORT}/dev/api-docs`);
  }
});

if (process.env.MONGO_URL == null) {
  logger.error('MONGO_URL not specified in environment');
  process.exit(1);
} else {
  safeMongooseConnection.connect(mongoUrl => {
    logger.info(`Connected to MongoDB att ${mongoUrl}`);
    serve();
  });
}

// Close the Mongoose connection, when receiving SIGINT
process.on('SIGINT', () => {
  console.log('\n'); /* eslint-disable-line */
  logger.info('Gracefully shutting down');
  logger.info('Closing the MongoDB connection');
  safeMongooseConnection.close(err => {
    if (err) {
      logger.log({
        level: 'error',
        message: 'Error shutting closing mongo connection',
        error: err
      });
    } else {
      logger.info('Mongo connection closed successfully');
    }
    process.exit(0);
  }, true);
});
