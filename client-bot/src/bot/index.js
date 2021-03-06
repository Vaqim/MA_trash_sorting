const { Telegraf } = require('telegraf');
const { client, organization, reciever, points, voucher } = require('./command');
const config = require('../config');

const bot = new Telegraf(config.botToken);

bot.start(client.createUser);

bot.hears('Мій баланс \u{1F4B5}', client.getUser);
bot.hears('Я хочу щось купити \u{1F911}', organization.getAllOrganizations);
bot.hears('Інформація про пункти здачі сміття \u{1F914}', reciever.getAllRecievers);

bot.action(/^[get_organization]+( (.)+)?$/, organization.getOrganizationById);
bot.action(/^[services]+( (.)+)?$/, organization.getServicesByOrgId);
bot.action(/^[get_reciever]+( (.)+)?$/, reciever.getRecieverById);
bot.action(/^[get_service]+( (.)+)?$/, organization.getServiceById);
bot.action(/^[trash_types]+( (.)+)?$/, reciever.getTrashTypesByRecieverId);
bot.action(/^[buy]+( (.)+)?$/, points.spendPoints);
bot.action(/^[activate]+( (.)+)?$/, voucher.activateVoucher);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.export = bot;
