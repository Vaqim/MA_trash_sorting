const { Scenes, Markup } = require('telegraf');

const logger = require('../../logger')(__filename);
const deleteMessage = require('../../utils/deleteMessage');
const api = require('../api');

const recKeyboard = Markup.keyboard([
  'Просмотреть позиции',
  'Создать позиции',
  'Изменить позиции',
  'Удалить позиции',
]).resize();

const skipKeyboard = Markup.inlineKeyboard([Markup.button.callback('Продолжить', 'skip')]);

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
        `Вы создали новый тип мусора\n
        Название: ${data.name}\n
        Коефициент: ${data.modifier}`,
        recKeyboard,
      );
      return ctx.scene.leave();
    } catch (error) {
      logger.error(error);
      await ctx.reply('Валли, у нас проблемы!');
      return ctx.scene.leave();
    }
  },
);

const infoTrashTypeScene = new Scenes.WizardScene(
  'INFO_TRASHTYPE_SCENE_ID',
  async (ctx) => {
    const { id } = ctx.from;
    const { mainMessage } = ctx.wizard.state;

    const data = await api.get(`/recievers/${id}/trash_types`);

    const buttons = data.map((service) => {
      return [Markup.button.callback(service.name, `info ${service.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply('Кажеться у вас пока что нет позиций, сначала создайте их');
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
  },
  async (ctx) => {
    const { data } = ctx.update.callback_query;
    const { mainMessage } = ctx.wizard.state;
    if (data === 'leave') return deleteMessage(ctx, mainMessage.id);
    const serviceId = data.split(' ')[1];
    const service = await api.get(`/trash_types/${serviceId}`);

    await ctx.editMessageText(
      `Тип: ${service.name}\nКоефициент: ${service.modifier}`,
      skipKeyboard,
    );

    return ctx.wizard.selectStep(0);
  },
);

const changeTrashTypeScene = new Scenes.WizardScene(
  'CHANGE_TRASHTYPE_SCENE_ID',
  async (ctx) => {
    const { id } = ctx.from;
    const { mainMessage } = ctx.wizard.state;

    const data = await api.get(`/recievers/${id}/trash_types`);

    const buttons = data.map((service) => {
      return [Markup.button.callback(service.name, `info ${service.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply('Кажеться у вас пока что нет типов мусора, сначала создайте их');
      return ctx.scene.leave();
    }

    buttons.push([Markup.button.callback('Выйти', `leave`)]);
    if (mainMessage) ctx.answerCbQuery();

    const message = await ctx.reply(
      'Выберете тип мусора, который вы хотите изменить:',
      Markup.inlineKeyboard(buttons),
    );

    ctx.wizard.state.mainMessage = message;
    return ctx.wizard.next();
  },
  async (ctx) => {
    const { data } = ctx.update.callback_query;
    const { mainMessage } = ctx.wizard.state;
    if (data === 'leave') return deleteMessage(ctx, mainMessage.id);
    const serviceId = data.split(' ')[1];

    ctx.wizard.state.updateService = {};
    ctx.wizard.state.serviceId = serviceId;
    ctx.answerCbQuery();
    await ctx.reply(
      `Отлично, тепер я буду спрашивать что поменять, а ты отвечай.\nЕсли не хочешь менять этот пункт просто напиши "-".\nИ так название:`,
    );

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { text } = ctx.message;
    if (text !== '-') ctx.wizard.state.updateService.name = text;

    await ctx.reply(`Коефициент:`);

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { text } = ctx.message;
    const { serviceId } = ctx.wizard.state;
    if (text !== '-') ctx.wizard.state.updateService.modifier = +text;

    const service = await api.put(`trash_types/${serviceId}`, ctx.wizard.state.updateService);

    await ctx.reply(
      `Тип изменён!\nНазвание: ${service.name}\nКоефициент: ${service.modifier}`,
      skipKeyboard,
    );

    return ctx.wizard.selectStep(0);
  },
);

const deleteTrashTypeScene = new Scenes.WizardScene(
  'DELETE_TRASHTYPE_SCENE_ID',
  async (ctx) => {
    const { id } = ctx.from;
    const { mainMessage } = ctx.wizard.state;
    const data = await api.get(`recievers/${id}/trash_types`);

    const buttons = data.map((service) => {
      return [Markup.button.callback(service.name, `delete ${service.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply('Кажеться у вас пока что нет типоу, сначала создайте их');
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
  },
  async (ctx) => {
    const { mainMessage } = ctx.wizard.state;
    const { data } = ctx.update.callback_query;
    if (data === 'leave') return deleteMessage(ctx, mainMessage.id);
    const serviceId = data.split(' ')[1];

    await api.del(`/trash_types/${serviceId}`);
    ctx.answerCbQuery();
    await ctx.editMessageText(`Сервис успешно удалён!`, skipKeyboard);

    return ctx.wizard.selectStep(0);
  },
);

// const editTrashTypeScene = new Scenes.WizardScene('EDIT_TRASHTYPE_SCENE_ID', async (ctx) => {
//   ctx.wizard.state.updateData = {};
// });

module.exports = [
  createTrashTypeScene,
  infoTrashTypeScene,
  changeTrashTypeScene,
  deleteTrashTypeScene,
];
