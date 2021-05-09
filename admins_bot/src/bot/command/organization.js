const { Scenes, Markup } = require('telegraf');
const api = require('../api');
const deleteMessage = require('../../utils/deleteMessage');
const logger = require('../../logger')(__filename);
const { orgKeyboard, skipKeyboard } = require('./keyboards');

const changeOrganizationScene = new Scenes.WizardScene(
  'CHANGE_ORGANIZATION_SCENE_ID',
  async (ctx) => {
    try {
      const message = await ctx.reply(
        `Введите название, если хотите пропустить нажмите на кнопку:`,
        skipKeyboard,
      );

      ctx.wizard.state.updateOrganization = {};

      ctx.wizard.state.mainMessage = message;

      return ctx.wizard.next();
    } catch (error) {
      logger.warn(error);
      await ctx.reply('Прозошла ошибка', orgKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const { mainMessage } = ctx.wizard.state;
      const { message_id: messageId } = mainMessage;
      const { id: chatId } = mainMessage.chat;

      if (ctx.message) ctx.wizard.state.updateOrganization.name = ctx.message.text;
      ctx.telegram.editMessageReplyMarkup(chatId, messageId);

      const message = await ctx.reply(`Телефон:`, skipKeyboard);

      ctx.wizard.state.mainMessage = message;

      return ctx.wizard.next();
    } catch (error) {
      logger.warn(error);
      await ctx.reply('Прозошла ошибка', orgKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const { mainMessage } = ctx.wizard.state;
      const { message_id: messageId } = mainMessage;
      const { id: chatId } = mainMessage.chat;

      if (ctx.message) ctx.wizard.state.updateOrganization.phone = ctx.message.text;
      ctx.telegram.editMessageReplyMarkup(chatId, messageId);

      const message = await ctx.reply(`Адрес:`, skipKeyboard);

      ctx.wizard.state.mainMessage = message;

      return ctx.wizard.next();
    } catch (error) {
      logger.warn(error);
      await ctx.reply('Прозошла ошибка', orgKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
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
    } catch (error) {
      logger.warn(error);
      await ctx.reply('Не удалось изменить организацию, попробуйте позже', orgKeyboard);
      return ctx.scene.leave();
    }
  },
);

const changeServiceScene = new Scenes.WizardScene(
  'CHANGE_SERVICE_SCENE_ID',
  async (ctx) => {
    try {
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
    } catch (error) {
      logger.warn(error);
      await ctx.reply('Не удалось получить сервисы, попробуйте позже', orgKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
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
    } catch (error) {
      logger.warn(error);
      await ctx.reply('Прозошла ошибка', orgKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const { mainMessage } = ctx.wizard.state;
      const { message_id: messageId } = mainMessage;
      const { id: chatId } = mainMessage.chat;

      if (ctx.message) ctx.wizard.state.updateService.name = ctx.message.text;
      ctx.telegram.editMessageReplyMarkup(chatId, messageId);

      const message = await ctx.reply(`Цена:`, skipKeyboard);

      ctx.wizard.state.mainMessage = message;

      return ctx.wizard.next();
    } catch (error) {
      logger.warn(error);
      await ctx.reply('Прозошла ошибка', orgKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const { mainMessage } = ctx.wizard.state;
      const { message_id: messageId } = mainMessage;
      const { id: chatId } = mainMessage.chat;

      if (ctx.message) ctx.wizard.state.updateService.price = ctx.message.text;
      ctx.telegram.editMessageReplyMarkup(chatId, messageId);

      const message = await ctx.reply(`Описание:`, skipKeyboard);

      ctx.wizard.state.mainMessage = message;

      return ctx.wizard.next();
    } catch (error) {
      logger.warn(error);
      await ctx.reply('Прозошла ошибка', orgKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
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
    } catch (error) {
      logger.warn(error);
      await ctx.reply('Не удалось изменить сервис, попробуйте позже', orgKeyboard);
      return ctx.scene.leave();
    }
  },
);
const infoServiceScene = new Scenes.WizardScene(
  'INFO_SERVICE_SCENE_ID',
  async (ctx) => {
    try {
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
    } catch (error) {
      logger.warn(error);
      await ctx.reply('Не удалось получить сервисы, попробуйте позже', orgKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
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
    } catch (error) {
      logger.warn(error);
      await ctx.reply('Не удалось получить сервис, попробуйте позже', orgKeyboard);
      return ctx.scene.leave();
    }
  },
);

const deleteServiceScene = new Scenes.WizardScene(
  'DELETE_SERVICE_SCENE_ID',
  async (ctx) => {
    try {
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
    } catch (error) {
      logger.warn(error);
      await ctx.reply('Не удалось получить сервисы, попробуйте позже', orgKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const { mainMessage } = ctx.wizard.state;
      const { data } = ctx.update.callback_query;
      if (data === 'leave') return deleteMessage(ctx, mainMessage.id, orgKeyboard);
      const serviceId = data.split(' ')[1];

      await api.del(`/organization/services/${serviceId}`);
      ctx.answerCbQuery();
      await ctx.editMessageText(`Сервис успешно удалён!`, skipKeyboard);

      return ctx.wizard.selectStep(0);
    } catch (error) {
      logger.warn(error);
      await ctx.reply('Не удалось удалить сервис, попробуйте позже', orgKeyboard);
      return ctx.scene.leave();
    }
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
    try {
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
    } catch (error) {
      logger.warn(error);
      await ctx.reply('Не удалось создать сервис, попробуйте позже', orgKeyboard);
      return ctx.scene.leave();
    }
  },
);

module.exports = [
  infoServiceScene,
  changeServiceScene,
  changeOrganizationScene,
  creationServiceScene,
  deleteServiceScene,
];
