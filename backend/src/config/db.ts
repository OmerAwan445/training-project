import ENV from '@src/common/constants/ENV';
import logger from 'jet-logger';
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
     
    const mongoUri = ENV.MongoUri;
    logger.info(JSON.stringify(ENV));
    if (!mongoUri) {
      logger.err('MONGO_URI environment variable is not defined');
      throw new Error('MONGO_URI environment variable is not defined');
    }
    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB');
    // await seedDB();
  } catch (err: unknown) {
    logger.err((err as Error).message);
    // eslint-disable-next-line n/no-process-exit
    process.exit(1); 
  }
};

export default connectDB;
