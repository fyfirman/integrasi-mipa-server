import winston from 'winston';
import config from '../config';

const myformat = winston.format.combine(
  winston.format((info) => {
    const newInfo = {
      ...info,
      level: info.level.toUpperCase(),
    };
    return newInfo;
  })(),
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss',
  }),
  winston.format.printf((info) => {
    let { message } = info;
    if (info.level.includes('DEBUG')) {
      message = `\n${JSON.stringify(info.message, null, 2)}`;
    }
    return `${info.timestamp} ${info.level}\t\t ${message}`;
  }),
);

const transports = [];
if (process.env.NODE_ENV !== 'development') {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new winston.transports.Console({
      format: myformat,
    }),
  );
}

const LoggerInstance = winston.createLogger({
  level: config.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports,
});

export default LoggerInstance;
