const { Scenes, Markup } = require('telegraf');
const api = require('../api');
const logger = require('../../logger')(__filename);

const orgKeyboard = Markup.keyboard([
  'Просмотреть сервисы',
  'Создать сервисы',
  'Удалить сервисы',
  'Изменить сервисы',
]).resize();
const recKeyboard = Markup.keyboard(['']).resize();
const skipKeyboard = Markup.inlineKeyboard([Markup.button.callback('Продолжить', 'skip')]);

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

const changeServiceScene = new Scenes.WizardScene(
  'CHANGE_SERVICE_SCENE_ID',
  async (ctx) => {
    const { id } = ctx.from;

    const data = await api.get(`/organization/${id}/services`);

    const buttons = data.map((service) => {
      return [Markup.button.callback(service.name, `info ${service.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply('Кажеться у вас пока что нет сервисов, сначала создайте их');
      return ctx.scene.leave();
    }

    buttons.push([Markup.button.callback('Выйти', `leave`)]);

    await ctx.reply('Выберете сервис, который вы хотите изменить:', Markup.inlineKeyboard(buttons));

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { data } = ctx.update.callback_query;
    if (data === 'leave') return ctx.scene.leave();
    const serviceId = data.split(' ')[1];

    ctx.wizard.state.updateService = {};
    ctx.wizard.state.serviceId = serviceId;

    await ctx.reply(
      `Отлично, тепер я буду спрашивать что поменять, а ты отвечай.\nЕсли не хочешь менять этот пункт просто напиши "-".\nИ так название:`,
    );

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { text } = ctx.message;
    if (text !== '-') ctx.wizard.state.updateService.name = text;

    await ctx.reply(`Цена:`);

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { text } = ctx.message;
    if (text !== '-') ctx.wizard.state.updateService.price = text;

    await ctx.reply(`Описание:`);

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { text } = ctx.message;
    const { serviceId } = ctx.wizard.state;
    if (text !== '-') ctx.wizard.state.updateService.description = text;

    const service = await api.put(
      `/organization/services/${serviceId}`,
      ctx.wizard.state.updateService,
    );

    await ctx.reply(
      `Сервис изменён!\nНазвание: ${service.name}\nЦена: ${service.price}\nОписание: ${service.description}`,
      skipKeyboard,
    );

    return ctx.wizard.selectStep(0);
  },
);
const infoServiceScene = new Scenes.WizardScene(
  'INFO_SERVICE_SCENE_ID',
  async (ctx) => {
    const { id } = ctx.from;

    const data = await api.get(`/organization/${id}/services`);

    const buttons = data.map((service) => {
      return [Markup.button.callback(service.name, `delete ${service.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply('Кажеться у вас пока что нет сервисов, сначала создайте их');
      return ctx.scene.leave();
    }

    buttons.push([Markup.button.callback('Выйти', `leave`)]);

    await ctx.reply('Выберете сервис, который хотите удалить:', Markup.inlineKeyboard(buttons));

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { data } = ctx.update.callback_query;
    if (data === 'leave') return ctx.scene.leave();
    const serviceId = data.split(' ')[1];
    const service = await api.get(`/organization/services/${serviceId}`);

    await ctx.reply(
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

    const data = await api.get(`/organization/${id}/services`);

    const buttons = data.map((service) => {
      return [Markup.button.callback(service.name, `delete ${service.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply('Кажеться у вас пока что нет сервисов, сначала создайте их');
      return ctx.scene.leave();
    }

    buttons.push([Markup.button.callback('Выйти', `leave`)]);

    await ctx.reply('Выберете сервис, который хотите удалить:', Markup.inlineKeyboard(buttons));

    return ctx.wizard.next();
  },
  async (ctx) => {
    const { data } = ctx.update.callback_query;
    if (data === 'leave') return ctx.scene.leave();
    const serviceId = data.split(' ')[1];

    await api.del(`/organization/services/${serviceId}`);

    await ctx.reply(`Сервис успешно удалён!`, skipKeyboard);

    return ctx.wizard.selectStep(0);
  },
);

const creationServiceScene = new Scenes.WizardScene(
  'CREATION_SERVICE_SCENE_ID',
  async (ctx) => {
    ctx.wizard.state.creationData = {};
    await ctx.reply('Отлично! тогда начнём\nНазвание вашего сервиса:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.creationData.name = ctx.message.text;
    await ctx.reply('И так!\nТеперь укажите цену в балах:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.wizard.state.creationData.price = ctx.message.text;
    await ctx.reply(
      'Последний шаг!\nНапишите краткое описание (вы можете пропустить этот шаг написав "-"):',
    );
    return ctx.wizard.next();
  },
  async (ctx) => {
    const { text } = ctx.message;
    ctx.wizard.state.creationData.organizationId = ctx.from.id;
    if (text !== '-') ctx.wizard.state.creationData.description = text;
    const data = await api.post('/organization/services', ctx.wizard.state.creationData);
    await ctx.reply(
      `Так, сервис создан:\nНазвание: ${data.name}\nЦена: ${data.price}\nОписание: ${
        data.description ? data.description : '-'
      }`,
    );
    return ctx.scene.leave();
  },
);

module.exports = {
  creationScene,
  infoServiceScene,
  changeServiceScene,
  creationServiceScene,
  deleteServiceScene,
};