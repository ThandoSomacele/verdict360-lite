const winston = require('winston');
const path = require('path');

const logLevel = process.env.LOG_LEVEL || 'info';
const logFile = process.env.LOG_FILE || './logs/app.log';

const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}] ${stack || message}`;
  })
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
    level: logLevel
  })
];

if (process.env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: logFile,
      format: logFormat,
      level: logLevel,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
}

const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports,
  exceptionHandlers: [
    new winston.transports.File({ filename: './logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: './logs/rejections.log' })
  ]
});

module.exports = logger;