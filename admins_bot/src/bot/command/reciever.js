const { Scenes, Markup } = require('telegraf');

const logger = require('../../logger')(__filename);

const api = require('../api');

const recKeyboard = Markup.keyboard([
  'Просмотреть позиции',
  'Создать позиции',
  'Изменить позиции',
  'Удалить позиции',
]).resize();

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

// const editTrashTypeScene = new Scenes.WizardScene('EDIT_TRASHTYPE_SCENE_ID', async (ctx) => {
//   ctx.wizard.state.updateData = {};
// });

module.exports = [createTrashTypeScene];
