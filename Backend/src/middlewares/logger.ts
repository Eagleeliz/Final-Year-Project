import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    // Write all errors to error.log
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    
    // 2. Write everything to combined.log
    new winston.transports.File({ filename: 'logs/combined.log' }),
    
    // Print to terminal
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
});

export default logger;