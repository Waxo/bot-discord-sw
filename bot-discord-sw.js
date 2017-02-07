require('dotenv').config();
const Discord = require('discord.js');
const logger = require('./app/utils/logger');

const bot = new Discord.Client();

const messageController = require('./app/message-controller.js');

bot.on('ready', () => {
  logger.log('info', 'Bot Started');
});

bot.on('message', messageController.incomingMessage);

bot.login(process.env.TOKEN);
