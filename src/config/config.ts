import dotenv from 'dotenv';

const port = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

export default {
  port,
  api: {
    prefix: '/api',
  },
  databaseUrl: process.env.MONGODB_URI,
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  jwtSecret: process.env.JWT_SECRET,
};
