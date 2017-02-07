const winston = require('winston');
const chalk = require('chalk');
const moment = require('moment');

const chooseColor = level => {
  switch (level) {
    case 'silly':
      return chalk.gray;
    case 'debug':
      return chalk.yellow;
    case 'verbose':
      return chalk.green;
    case 'info':
      return chalk.blue;
    case 'warn':
      return chalk.magenta;
    case 'error':
      return chalk.red;
    default:
      return chalk.white;
  }
};

const wl = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: () => {
        return moment().format('HH:mm:ss');
      },
      formatter: options => { // jshint ignore:line
        const color = chooseColor(options.level.toLowerCase());

        const message = [
          color(`[${options.timestamp()}]`),
          color(`${options.level.toUpperCase()}:`),
          options.message || '',
          (options.meta && Object.keys(options.meta).length) ?
            `${'\n\t'}${JSON.stringify(options.meta)}` : ''
        ];

        return message.join(' ');
      }
    })
  ]
});

wl.level = process.env.LOG_LEVEL;

const logger = {
  silly(msg) {
    wl.log('silly', msg);
  },
  debug(msg) {
    wl.log('debug', msg);
  },
  verbose(msg) {
    wl.log('verbose', msg);
  },
  info(msg) {
    wl.log('info', msg);
  },
  warn(msg) {
    wl.log('warn', msg);
  },
  error(msg) {
    wl.log('error', msg);
  },
  log(level, msg) {
    wl.log(level, msg);
  }
};

module.exports = logger;
