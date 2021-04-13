const { Telegraf } = require('telegraf');
const { client, organization, reciever, points } = require('./command');
const config = require('../config');

const bot = new Telegraf(config.botToken);

// Можно использовать id телеграма для определения юзера
bot.start(client.createUser);
bot.command('whoami', client.getUser);
bot.command('organization', organization.getAllOrganizations);
bot.command('reciever', reciever.getAllRecievers);

bot.action(/^[get_organization]+( (.)+)?$/, organization.getOrganizationById);
bot.action(/^[services]+( (.)+)?$/, organization.getServicesByOrgId);
bot.action(/^[get_reciever]+( (.)+)?$/, reciever.getRecieverById);
bot.action(/^[get_service]+( (.)+)?$/, organization.getServiceById);
bot.action(/^[trash_types]+( (.)+)?$/, reciever.getTrashTypesByRecieverId);
bot.action(/^[buy]+( (.)+)?$/, points.spendPoints);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.export = bot;
