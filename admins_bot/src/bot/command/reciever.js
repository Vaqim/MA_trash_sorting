const { Scenes, Markup } = require('telegraf');
const { recKeyboard, skipKeyboard } = require('./keyboards');

const logger = require('../../logger')(__filename);
const deleteMessage = require('../../utils/deleteMessage');
const api = require('../api');

const createTrashTypeScene = new Scenes.WizardScene(
  'CREATE_TRASHTYPE_SCENE_ID',
  async (ctx) => {
    ctx.wizard.state.creationData = {};
    await ctx.reply('Ведите название: ');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.creationData.name = ctx.message.text;
    await ctx.reply('Укажите коефициент стоимости: ');
    return ctx.wizard.next();
  },
  async (ctx) => {
    try {
      ctx.wizard.state.creationData.modifier = +ctx.message.text;
      ctx.wizard.state.creationData.telegram_id = ctx.message.from.id;

      const data = await api.post(
        `/recievers/${ctx.message.from.id}/trash_types`,
        ctx.wizard.state.creationData,
      );
      logger.debug('new trash type', data);
      await ctx.reply(
        `Вы создали новый тип мусора\nНазвание: ${data.name}\nКоефициент: ${data.modifier}`,
        recKeyboard,
      );
      return ctx.scene.leave();
    } catch (error) {
      logger.error(error);
      await ctx.reply('Не удалось создать тип мусора, попробуйте позже', recKeyboard);
      return ctx.scene.leave();
    }
  },
);

const infoTrashTypeScene = new Scenes.WizardScene(
  'INFO_TRASHTYPE_SCENE_ID',
  async (ctx) => {
    try {
      const { id } = ctx.from;
      const { mainMessage } = ctx.wizard.state;

      const data = await api.get(`/recievers/${id}/trash_types`);

      const buttons = data.map((trash) => {
        return [Markup.button.callback(trash.name, `info ${trash.id}`)];
      });

      if (!buttons.length) {
        await ctx.reply('Кажется у вас пока что нет позиций, сначала создайте их', recKeyboard);
        return ctx.scene.leave();
      }

      buttons.push([Markup.button.callback('Выйти', `leave`)]);
      if (mainMessage) {
        await ctx.editMessageText(
          'Выберете позицию, которую хотите просмотреть:',
          Markup.inlineKeyboard(buttons),
        );

        ctx.answerCbQuery();
        return ctx.wizard.next();
      }

      const message = await ctx.reply(
        'Выберете позицию, которую хотите просмотреть:',
        Markup.inlineKeyboard(buttons),
      );

      ctx.wizard.state.mainMessage = message;

      return ctx.wizard.next();
    } catch (error) {
      logger.error(error);
      await ctx.reply('Не удалось получить типы мусора, попробуйте позже', recKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const { data } = ctx.update.callback_query;
      const { mainMessage } = ctx.wizard.state;
      if (data === 'leave') return deleteMessage(ctx, mainMessage.id, recKeyboard);
      const trashId = data.split(' ')[1];
      const trashType = await api.get(`/trash_types/${trashId}`);

      await ctx.editMessageText(
        `Тип: ${trashType.name}\nКоефициент: ${trashType.modifier}`,
        skipKeyboard,
      );

      return ctx.wizard.selectStep(0);
    } catch (error) {
      logger.error(error);
      await ctx.reply('Не удалось создать тип мусора, попробуйте позже', recKeyboard);
      return ctx.scene.leave();
    }
  },
);

const changeTrashTypeScene = new Scenes.WizardScene(
  'CHANGE_TRASHTYPE_SCENE_ID',
  async (ctx) => {
    try {
      const { id } = ctx.from;
      const { mainMessage } = ctx.wizard.state;

      const data = await api.get(`/recievers/${id}/trash_types`);

      const buttons = data.map((type) => {
        return [Markup.button.callback(type.name, `info ${type.id}`)];
      });

      if (!buttons.length) {
        await ctx.reply(
          'Кажется у вас пока что нет типов мусора, сначала создайте их',
          recKeyboard,
        );
        return ctx.scene.leave();
      }

      buttons.push([Markup.button.callback('Выйти', `leave`)]);
      if (mainMessage) {
        ctx.editMessageText(
          'Выберете тип, который вы хотите изменить:',
          Markup.inlineKeyboard(buttons),
        );

        ctx.answerCbQuery();
        return ctx.wizard.next();
      }

      const message = await ctx.reply(
        'Выберете тип мусора, который вы хотите изменить:',
        Markup.inlineKeyboard(buttons),
      );

      ctx.wizard.state.mainMessage = message;
      return ctx.wizard.next();
    } catch (error) {
      logger.error(error);
      await ctx.reply('Не удалось получить типы мусора, попробуйте позже', recKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const { data } = ctx.update.callback_query;
      const { mainMessage } = ctx.wizard.state;
      if (data === 'leave') return deleteMessage(ctx, mainMessage.id, recKeyboard);
      const trashTypeId = data.split(' ')[1];

      ctx.wizard.state.updateTrashType = {};
      ctx.wizard.state.trashTypeId = trashTypeId;
      ctx.answerCbQuery();
      const message = await ctx.reply(
        `Отлично, тепер я буду спрашивать что поменять, а ты отвечай.\nЕсли не хочешь менять этот пункт просто напиши "-".\nИ так название:`,
        skipKeyboard,
      );

      ctx.wizard.state.mainMessage = message;

      return ctx.wizard.next();
    } catch (error) {
      logger.error(error);
      await ctx.reply('Произошла ошибка', recKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const { mainMessage } = ctx.wizard.state;
      const { message_id: messageId } = mainMessage;
      const { id: chatId } = mainMessage.chat;

      if (ctx.message) ctx.wizard.state.updateTrashType.name = ctx.message.text;
      ctx.telegram.editMessageReplyMarkup(chatId, messageId);

      const message = await ctx.reply(`Коефициент:`, skipKeyboard);

      ctx.wizard.state.mainMessage = message;

      return ctx.wizard.next();
    } catch (error) {
      logger.error(error);
      await ctx.reply('Произошла ошибка', recKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const { mainMessage } = ctx.wizard.state;
      const { message_id: messageId } = mainMessage;
      const { id: chatId } = mainMessage.chat;

      if (ctx.message) ctx.wizard.state.updateTrashType.modifier = ctx.message.text;
      ctx.telegram.editMessageReplyMarkup(chatId, messageId);

      const { trashTypeId } = ctx.wizard.state;
      const { updateTrashType } = ctx.wizard.state;

      if (Object.keys(updateTrashType).length !== 0) {
        const trashType = await api.put(
          `trash_types/${trashTypeId}`,
          ctx.wizard.state.updateTrashType,
        );

        ctx.wizard.state.mainMessage = await ctx.reply(
          `Тип изменён!\nНазвание: ${trashType.name}\nКоефициент: ${trashType.modifier}`,
          skipKeyboard,
        );
      } else {
        ctx.wizard.state.mainMessage = await ctx.reply(`Изменения не были внесены`, skipKeyboard);
      }

      return ctx.wizard.selectStep(0);
    } catch (error) {
      logger.error(error);
      await ctx.reply('Не удалось изменить тип мусора, попробуйте позже', recKeyboard);
      return ctx.scene.leave();
    }
  },
);

const deleteTrashTypeScene = new Scenes.WizardScene(
  'DELETE_TRASHTYPE_SCENE_ID',
  async (ctx) => {
    try {
      const { id } = ctx.from;
      const { mainMessage } = ctx.wizard.state;
      const data = await api.get(`recievers/${id}/trash_types`);

      const buttons = data.map((trash) => {
        return [Markup.button.callback(trash.name, `delete ${trash.id}`)];
      });

      if (!buttons.length) {
        await ctx.reply('Кажется у вас пока что нет типоу, сначала создайте их', recKeyboard);
        return ctx.scene.leave();
      }

      buttons.push([Markup.button.callback('Выйти', `leave`)]);

      if (mainMessage) {
        await ctx.editMessageText(
          'Выберите тип, который хотите удалить:',
          Markup.inlineKeyboard(buttons),
        );

        return ctx.wizard.next();
      }

      const message = await ctx.reply(
        'Выберете тип, который хотите удалить:',
        Markup.inlineKeyboard(buttons),
      );
      ctx.wizard.state.mainMessage = message;

      return ctx.wizard.next();
    } catch (error) {
      logger.error(error);
      await ctx.reply('Не удалось получить типы мусора, попробуйте позже', recKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const { mainMessage } = ctx.wizard.state;
      const { data } = ctx.update.callback_query;
      if (data === 'leave') return deleteMessage(ctx, mainMessage.id, recKeyboard);
      const trashId = data.split(' ')[1];

      await api.del(`/trash_types/${trashId}`);
      ctx.answerCbQuery();
      await ctx.editMessageText(`Тип мусора успешно удалён!`, skipKeyboard);

      return ctx.wizard.selectStep(0);
    } catch (error) {
      logger.error(error);
      await ctx.reply('Не удалось удалить тип мусора, попробуйте позже', recKeyboard);
      return ctx.scene.leave();
    }
  },
);

const calculateTrash = new Scenes.WizardScene(
  'CALCULATE_TRASH_SCENE_ID',
  async (ctx) => {
    try {
      const { id } = ctx.from;
      const { trash } = ctx.wizard.state;
      const data = await api.get(`recievers/${id}/trash_types`);

      const buttons = data.map((trashType) => {
        return [Markup.button.callback(trashType.name, `add ${trashType.id}`)];
      });

      if (!buttons.length) {
        await ctx.reply('Кажется у вас пока что нет типоу, сначала создайте их', recKeyboard);
        return ctx.scene.leave();
      }

      buttons.push([
        Markup.button.callback('Рассчитать', `calculate`),
        Markup.button.callback('Выйти', `leave`),
      ]);

      const message = await ctx.reply(
        'Выберите тип мусора, если вы закончили добавлять мусор нажмите "Рассчитать"',
        Markup.inlineKeyboard(buttons),
      );

      if (trash) {
        trash.weight = +ctx.message.text;
        ctx.wizard.state.trashTypes.push(trash);
      } else {
        ctx.wizard.state.trashTypes = [];
      }
      ctx.wizard.state.mainMessage = message;
      return ctx.wizard.next();
    } catch (error) {
      logger.error(error);
      await ctx.reply('Не удалось получить типы мусора, попробуйте позже', recKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    const { mainMessage } = ctx.wizard.state;
    const { data } = ctx.update.callback_query;
    if (data === 'leave') return deleteMessage(ctx, mainMessage.id, recKeyboard);
    if (data === 'calculate') {
      try {
        const { trashTypes } = ctx.wizard.state;
        const points = await api.post(`/points/calculate`, trashTypes);
        await ctx.reply(
          `Количество балов: ${points.points}\nВведите ник пользователя, которому хотите начислить баллы`,
        );

        ctx.wizard.state.points = points.points;
        return ctx.wizard.next();
      } catch (error) {
        logger.error(error);
        await ctx.reply('Не удалось удалить тип мусора, попробуйте позже', recKeyboard);
        return ctx.scene.leave();
      }
    }
    try {
      const trashId = data.split(' ')[1];

      const trashType = await api.get(`/trash_types/${trashId}`);

      ctx.wizard.state.trash = { name: trashType.name, modifier: trashType.modifier };

      await ctx.reply('Введите вес мусора в кг');

      ctx.wizard.selectStep(0);
    } catch (error) {
      logger.error(error);
      await ctx.reply('Не удалось найти тип мусора, попробуйте позже', recKeyboard);
      return ctx.scene.leave();
    }
  },
  async (ctx) => {
    try {
      const { points } = ctx.wizard.state;

      await api.post(`/points/add`, { login: ctx.message.text, pointsAmount: points });

      await ctx.reply('Баллы успешно начислены', recKeyboard);

      ctx.scene.leave();
    } catch (error) {
      logger.error(error);
      await ctx.reply('Не удалось начислить баллы, попробуйте позже', recKeyboard);
      return ctx.scene.leave();
    }
  },
);
module.exports = [
  createTrashTypeScene,
  infoTrashTypeScene,
  changeTrashTypeScene,
  deleteTrashTypeScene,
  calculateTrash,
];
