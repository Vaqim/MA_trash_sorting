const { Scenes, Markup } = require('telegraf');
const api = require('../api');
const logger = require('../../logger')(__filename);
const deleteMessage = require('../../utils/deleteMessage');
const { orgKeyboard, recKeyboard, skipKeyboard } = require('./keyboards');

const creationScene = new Scenes.WizardScene(
  'CREATION_SCENE_ID',
  async (ctx) => {
    ctx.wizard.state.creationData = {};
    await ctx.reply(
      'Кто это?',
      Markup.inlineKeyboard([
        Markup.button.callback('Организация', 'organization'),
        Markup.button.callback('Точка приема мусора', 'reciever'),
      ]),
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    const { data: type, from } = ctx.update.callback_query;
    let data;
    if (type === 'organization') {
      data = await api.get(`/organization/bot/${from.id}`);
    } else {
      data = await api.get(`/recievers/bot/${from.id}`);
    }
    ctx.answerCbQuery();
    if (typeof data === 'object') {
      const currentKeyboard = type === 'organization' ? orgKeyboard : recKeyboard;
      await ctx.reply('Такой пользователь уже существует', currentKeyboard);
      return ctx.scene.leave();
    }
    ctx.wizard.state.creationData.userType = type;
    await ctx.reply('Теперь введите название');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.creationData.name = ctx.message.text;
    await ctx.reply('Теперь введите номер телефона, по которому можна обратиться к организации');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.creationData.phone = ctx.message.text;
    await ctx.reply('Теперь введите адресс по которому можна вас найти');
    return ctx.wizard.next();
  },
  async (ctx) => {
    try {
      ctx.wizard.state.creationData.address = ctx.message.text;
      ctx.wizard.state.creationData.telegram_id = ctx.message.from.id;
      ctx.wizard.state.creationData.login = ctx.message.from.username;

      const data = await api.post('/auth/registration', ctx.wizard.state.creationData);
      const currentKeyboard =
        ctx.wizard.state.creationData.userType === 'organization' ? orgKeyboard : recKeyboard;
      await ctx.reply(
        `Отлично!\nНазвание: ${data.name}\nПароль: ${data.password}`,
        currentKeyboard,
      );
      return ctx.scene.leave();
    } catch (error) {
      ctx.reply('Что-то не получилось');
      logger.error(error);
    }
  },
);

const changeOrganizationScene = new Scenes.WizardScene(
  'CHANGE_ORGANIZATION_SCENE_ID',
  async (ctx) => {
    const message = await ctx.reply(
      `Введите название, если хотите пропустить нажмите на кнопку:`,
      skipKeyboard,
    );

    ctx.wizard.state.updateOrganization = {};

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { mainMessage } = ctx.wizard.state;
    const { message_id: messageId } = mainMessage;
    const { id: chatId } = mainMessage.chat;

    if (ctx.message) ctx.wizard.state.updateOrganization.name = ctx.message.text;
    ctx.telegram.editMessageReplyMarkup(chatId, messageId);

    const message = await ctx.reply(`Телефон:`, skipKeyboard);

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { mainMessage } = ctx.wizard.state;
    const { message_id: messageId } = mainMessage;
    const { id: chatId } = mainMessage.chat;

    if (ctx.message) ctx.wizard.state.updateOrganization.phone = ctx.message.text;
    ctx.telegram.editMessageReplyMarkup(chatId, messageId);

    const message = await ctx.reply(`Адрес:`, skipKeyboard);

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { mainMessage } = ctx.wizard.state;
    const { message_id: messageId } = mainMessage;
    const { id: chatId } = mainMessage.chat;

    if (ctx.message) ctx.wizard.state.updateOrganization.address = ctx.message.text;
    ctx.telegram.editMessageReplyMarkup(chatId, messageId);

    const { updateOrganization } = ctx.wizard.state;

    if (Object.keys(updateOrganization).length !== 0) {
      const organization = await api.put(
        `/organization/${mainMessage.chat.id}`,
        ctx.wizard.state.updateOrganization,
      );

      console.log(organization);

      ctx.wizard.state.mainMessage = await ctx.reply(
        `Организация изменёна!\nНазвание: ${organization.name}\nТелефон: ${organization.phone}\nАдрес: ${organization.address}`,
        orgKeyboard,
      );
    } else {
      ctx.wizard.state.mainMessage = await ctx.reply(`Изменения не были внесены`, orgKeyboard);
    }

    return ctx.scene.leave();
  },
);

const changeServiceScene = new Scenes.WizardScene(
  'CHANGE_SERVICE_SCENE_ID',
  async (ctx) => {
    const { id } = ctx.from;
    const { mainMessage } = ctx.wizard.state;

    const data = await api.get(`/organization/${id}/services`);

    const buttons = data.map((service) => {
      return [Markup.button.callback(service.name, `info ${service.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply('Кажеться у вас пока что нет сервисов, сначала создайте их', orgKeyboard);
      return ctx.scene.leave();
    }

    buttons.push([Markup.button.callback('Выйти', `leave`)]);
    if (mainMessage) {
      ctx.editMessageText(
        'Выберете сервис, который вы хотите изменить:',
        Markup.inlineKeyboard(buttons),
      );

      ctx.answerCbQuery();
      return ctx.wizard.next();
    }

    const message = await ctx.reply(
      'Выберете сервис, который вы хотите изменить:',
      Markup.inlineKeyboard(buttons),
    );

    ctx.wizard.state.mainMessage = message;
    return ctx.wizard.next();
  },
  async (ctx) => {
    const { data } = ctx.update.callback_query;
    const { mainMessage } = ctx.wizard.state;
    if (data === 'leave') return deleteMessage(ctx, mainMessage.id, orgKeyboard);
    const serviceId = data.split(' ')[1];

    ctx.wizard.state.updateService = {};
    ctx.wizard.state.serviceId = serviceId;
    ctx.answerCbQuery();
    const message = await ctx.editMessageText(
      `Отлично, тепер я буду спрашивать что поменять, а ты отвечай.\nЕсли не хочешь менять этот пункт просто нажми на кнопку.\nИ так название:`,
      skipKeyboard,
    );

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { mainMessage } = ctx.wizard.state;
    const { message_id: messageId } = mainMessage;
    const { id: chatId } = mainMessage.chat;

    if (ctx.message) ctx.wizard.state.updateService.name = ctx.message.text;
    ctx.telegram.editMessageReplyMarkup(chatId, messageId);

    const message = await ctx.reply(`Цена:`, skipKeyboard);

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { mainMessage } = ctx.wizard.state;
    const { message_id: messageId } = mainMessage;
    const { id: chatId } = mainMessage.chat;

    if (ctx.message) ctx.wizard.state.updateService.price = ctx.message.text;
    ctx.telegram.editMessageReplyMarkup(chatId, messageId);

    const message = await ctx.reply(`Описание:`, skipKeyboard);

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { mainMessage } = ctx.wizard.state;
    const { message_id: messageId } = mainMessage;
    const { id: chatId } = mainMessage.chat;

    if (ctx.message) ctx.wizard.state.updateService.description = ctx.message.text;
    ctx.telegram.editMessageReplyMarkup(chatId, messageId);

    const { serviceId } = ctx.wizard.state;
    const { updateService } = ctx.wizard.state;

    if (Object.keys(updateService).length !== 0) {
      const service = await api.put(
        `/organization/services/${serviceId}`,
        ctx.wizard.state.updateService,
      );

      ctx.wizard.state.mainMessage = await ctx.reply(
        `Сервис изменён!\nНазвание: ${service.name}\nЦена: ${service.price}\nОписание: ${service.description}`,
        skipKeyboard,
      );
    } else {
      ctx.wizard.state.mainMessage = await ctx.reply(`Изменения не были внесены`, skipKeyboard);
    }

    return ctx.wizard.selectStep(0);
  },
);
const infoServiceScene = new Scenes.WizardScene(
  'INFO_SERVICE_SCENE_ID',
  async (ctx) => {
    const { id } = ctx.from;
    const { mainMessage } = ctx.wizard.state;

    const data = await api.get(`/organization/${id}/services`);

    const buttons = data.map((service) => {
      return [Markup.button.callback(service.name, `info ${service.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply('Кажеться у вас пока что нет сервисов, сначала создайте их', orgKeyboard);
      return ctx.scene.leave();
    }

    buttons.push([Markup.button.callback('Выйти', `leave`)]);
    if (mainMessage) {
      await ctx.editMessageText(
        'Выберете сервис, который хотите просмотреть:',
        Markup.inlineKeyboard(buttons),
      );

      ctx.answerCbQuery();
      return ctx.wizard.next();
    }

    const message = await ctx.reply(
      'Выберете сервис, который хотите просмотреть:',
      Markup.inlineKeyboard(buttons),
    );

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { data } = ctx.update.callback_query;
    const { mainMessage } = ctx.wizard.state;
    if (data === 'leave') return deleteMessage(ctx, mainMessage.id, orgKeyboard);
    const serviceId = data.split(' ')[1];
    const service = await api.get(`/organization/services/${serviceId}`);

    await ctx.editMessageText(
      `Название: ${service.name}\nЦена: ${service.price}\nОписание: ${
        service.description ? service.description : '-'
      }`,
      skipKeyboard,
    );

    return ctx.wizard.selectStep(0);
  },
);

const deleteServiceScene = new Scenes.WizardScene(
  'DELETE_SERVICE_SCENE_ID',
  async (ctx) => {
    const { id } = ctx.from;
    const { mainMessage } = ctx.wizard.state;
    const data = await api.get(`/organization/${id}/services`);

    const buttons = data.map((service) => {
      return [Markup.button.callback(service.name, `delete ${service.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply('Кажеться у вас пока что нет сервисов, сначала создайте их', orgKeyboard);
      return ctx.scene.leave();
    }

    buttons.push([Markup.button.callback('Выйти', `leave`)]);

    if (mainMessage) {
      await ctx.editMessageText(
        'Выберете сервис, который хотите удалить:',
        Markup.inlineKeyboard(buttons),
      );

      return ctx.wizard.next();
    }

    const message = await ctx.reply(
      'Выберете сервис, который хотите удалить:',
      Markup.inlineKeyboard(buttons),
    );
    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { mainMessage } = ctx.wizard.state;
    const { data } = ctx.update.callback_query;
    if (data === 'leave') return deleteMessage(ctx, mainMessage.id, orgKeyboard);
    const serviceId = data.split(' ')[1];

    await api.del(`/organization/services/${serviceId}`);
    ctx.answerCbQuery();
    await ctx.editMessageText(`Сервис успешно удалён!`, skipKeyboard);

    return ctx.wizard.selectStep(0);
  },
);

const creationServiceScene = new Scenes.WizardScene(
  'CREATION_SERVICE_SCENE_ID',
  async (ctx) => {
    ctx.wizard.state.creationData = {};
    await ctx.reply('Название вашего сервиса:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.creationData.name = ctx.message.text;
    await ctx.reply('Теперь укажите цену в балах:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.creationData.price = ctx.message.text;
    const message = await ctx.reply(
      'Последний шаг!\nНапишите краткое описание (вы можете пропустить этот шаг нажав на кнопку):',
      skipKeyboard,
    );

    ctx.wizard.state.cbMessage = message;
    return ctx.wizard.next();
  },
  async (ctx) => {
    const { cbMessage } = ctx.wizard.state;
    if (ctx.message) ctx.wizard.state.creationData.description = ctx.message.text;
    ctx.telegram.editMessageReplyMarkup(cbMessage.chat.id, cbMessage.message_id);
    ctx.wizard.state.creationData.organizationId = ctx.from.id;

    const data = await api.post('/organization/services', ctx.wizard.state.creationData);
    await ctx.reply(
      `Так, сервис создан:\nНазвание: ${data.name}\nЦена: ${data.price}\nОписание: ${
        data.description ? data.description : '-'
      }`,
      orgKeyboard,
    );
    return ctx.scene.leave();
  },
);

module.exports = [
  creationScene,
  infoServiceScene,
  changeServiceScene,
  changeOrganizationScene,
  creationServiceScene,
  deleteServiceScene,
];
