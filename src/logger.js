const {createLogger, format, transports} = require('winston');

const consoleFormatter = format.combine(
    format.colorize(),
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.align(),
    format.printf(
        info => `[${info.timestamp}] ${info.level}: ${info.message}`
    ),
    format.errors({stack: true}),
    format.splat(),
);
const fileFormatter = format.combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(
        info => `[${info.timestamp}] ${info.level}: ${info.message}`
    ),
    format.errors({stack: true}),
    format.json(),
);
const usedTransports = [
    new transports.File({
        filename: `${__dirname}/../logs/error.log`,
        level: 'error',
        tailable: true,
        maxsize: 1024 * 1024
    }),
    new transports.File({filename: `${__dirname}/../logs/verbose.log`, tailable: true, maxsize: 1024 * 1024}),
];

// Only add the console transport when not in test mode - jest --silent doesn't work
//if (process.env.NODE_ENV !== 'test') {
    usedTransports.push(new transports.Console({
        format: consoleFormatter
    }));
//}

/**
 * Exported winston logger instance
 * @type {winston.Logger}
 */
const logger = createLogger({
    level: 'silly',
    format: fileFormatter,
    transports: usedTransports
});

module.exports = logger;