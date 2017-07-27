const BluebirdPromise = require('bluebird');
const logger = require('./utils/logger');
const swarfarmDB = require('./swarfarm');

const possibleRoles = [
  'GB10',
  'DB10',
  'NB10',
  'TOA',
  'TOAH',
  'RAID4',
  'RAID5',
  'RUNES'
];

const availableActions = {
  ping(message) {
    message.channel.sendMessage('pong');
  },
  clear(message, args) {
    logger.log('info', `Clear by ${message.author.username}`);
    if (message.member.hasPermission('ADMINISTRATOR')) {
      message.channel.fetchMessages(args[0] ? {limit: Number(args[0]) + 1} : '')
        .then(messages => {
          const msgToDel = messages.filter(msg => !msg.pinned);
          // It's a collection, 1 is to access the message object
          return BluebirdPromise.map(msgToDel, message => message[1].delete());
        })
        .then(() => {
          message.channel.sendMessage(
            `${message.author.username} just cleaned the chat`);
        })
        .catch(err => logger.log('error', err));
    } else {
      message.channel.sendMessage(
        'Tu n\'as pas les badges nécessaires pour me contrôler !');
    }
  },
  register(message, args) {
    logger.log('info', `Register by ${message.author.username}`);
    if (message.member.hasPermission('ADMINISTRATOR')) {
      swarfarmDB.register(args[0], args[1])
        .then(msg => message.channel.sendMessage(msg));
    } else {
      message.channel.sendMessage(
        'Tu n\'as pas les badges nécessaires pour me contrôler !');
    }
  },
  swarfarm(message, args) {
    swarfarmDB.getSwarfarm(args[0])
      .then(msg => message.channel.sendMessage(msg));
  },
  addswarfarmalias(message, args) {
    logger.log('info', `Add swarfarm alias by ${message.author.username}`);
    if (message.member.hasPermission('ADMINISTRATOR')) {
      swarfarmDB.addAlias(args[0], args[1])
        .then(msg => message.channel.sendMessage(msg));
    } else {
      message.channel.sendMessage(
        'Tu n\'as pas les badges nécessaires pour me contrôler !');
    }
  },
  removeswarfarmalias(message, args) {
    logger.log('info', `Remove swarfarm alias by ${message.author.username}`);
    if (message.member.hasPermission('ADMINISTRATOR')) {
      swarfarmDB.removeAlias(args[0], args[1])
        .then(msg => message.channel.sendMessage(msg));
    } else {
      message.channel.sendMessage(
        'Tu n\'as pas les badges nécessaires pour me contrôler !');
    }
  },
  removeswarfarm(message, args) {
    logger.log('info', `Remove swarfarm by ${message.author.username}`);
    if (message.member.hasPermission('ADMINISTRATOR')) {
      swarfarmDB.removeSwafarm(args[0]);
      message.channel.sendMessage('Swarfarm deleted');
    } else {
      message.channel.sendMessage(
        'Tu n\'as pas les badges nécessaires pour me contrôler !');
    }
  },
  iam(message, args) {
    logger.log('info', `Add group`);
    const addedRoles = [];
    let youHacker = false;
    args.map(g => g.toUpperCase()).forEach(role => {
      if (possibleRoles.indexOf(role) >= 0) {
        addedRoles.push(
          message.guild.roles.filter(r => r.name === role).first());
      } else {
        youHacker = true;
      }
    });

    message.member.addRoles(addedRoles)
      .then(() => message.channel.sendMessage(`Roles added${(youHacker) ?
        ', don\'t try to hack me i`ll collapse your face' : ''}`))
      .catch(err => message.channel.sendMessage(err));
  },
  iamnot(message, args) {
    logger.log('info', `Remove group`);
    const removedRoles = [];
    let youHacker = false;
    args.map(g => g.toUpperCase()).forEach(role => {
      if (possibleRoles.indexOf(role) >= 0) {
        removedRoles.push(
          message.guild.roles.filter(r => r.name === role).first());
      } else {
        youHacker = true;
      }
    });

    message.member.removeRoles(removedRoles)
      .then(() => message.channel.sendMessage(
        `Roles removed${(youHacker) ?
          ', don\'t try to hack me i`ll collapse your face' : ''}`))
      .catch(err => message.channel.sendMessage(err));
  },
  ehp(message, args) {
    const msg = Number(args[0]) * (1000 + (Number(args[1]) * 3)) * 0.001;
    message.channel.sendMessage(`${Math.floor(msg)} ehp`);
  },
  ehpd(message, args) {
    const msg = Number(args[0]) * (1000 + (Number(args[1]) * 1.5)) * 0.001;
    message.channel.sendMessage(`${Math.floor(msg)} ehp with break def`);
  }
};

const messageController = {
  incomingMessage(message) {
    if (message.content.indexOf('!') === 0) {
      const content = message.content.replace('!', '');
      const args = content.split(' ');
      const action = args.splice(0, 1);
      if (availableActions[action]) {
        availableActions[action](message, args);
      } else {
        logger.log('silly', `Not an action : ${content}`);
      }
    }
  }
};

module.exports = messageController;
