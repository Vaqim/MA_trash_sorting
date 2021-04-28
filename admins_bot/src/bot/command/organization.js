const { Scenes, Markup } = require('telegraf');
const api = require('../api');
const logger = require('../../logger')(__filename);

// ДЛЯ ВАДИМА
// Нужно ещё допилить напильником, но основной функционал работает

const orgKeyboard = Markup.keyboard(['Просмотреть сервисы', 'Создать сервисы']).resize();
const recKeyboard = Markup.keyboard(['']).resize();
const skipKeyboard = Markup.inlineKeyboard([Markup.button.callback('Продолжить', 'skip')]);

const steps = { info: 6, delete: 7, change: 2 };

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
    if (!data.length) await ctx.scene.leave();
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
      await ctx.reply(`Отлично!\nНазвание: ${data.name}\nПароль: ${data.password}`, orgKeyboard);
      return ctx.scene.leave();
    } catch (error) {
      ctx.reply('Что-то не получилось');
      logger.error(error);
    }
  },
);

const serviceScene = new Scenes.WizardScene(
  'SERVICE_SCENE_ID',
  async (ctx) => {
    const { id } = ctx.from;

    const data = await api.get(`/organization/${id}/services`);

    const buttons = data.map((service) => {
      return [
        Markup.button.callback(service.name, `info ${service.id}`),
        Markup.button.callback(`Изменить`, `change ${service.id}`),
        Markup.button.callback(`Удалить`, `delete ${service.id}`),
      ];
    });

    await ctx.reply('Выберете сервис:', Markup.inlineKeyboard(buttons));

    return ctx.wizard.next();
  },
  async (ctx) => {
    const [operation, id] = ctx.update.callback_query.data.split(' ');
    const requiredStep = steps[operation];
    ctx.wizard.state.serviceId = id;

    ctx.reply('Вы точно хотите это сделать?', skipKeyboard);

    return ctx.wizard.selectStep(requiredStep);
  },
  async (ctx) => {
    ctx.wizard.state.updateService = {};

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
  async (ctx) => {
    const { serviceId } = ctx.wizard.state;
    console.log(serviceId);
    const service = await api.get(`/organization/services/${serviceId}`);

    await ctx.reply(
      `Название: ${service.name}\nЦена: ${service.price}\nОписание: ${
        service.description ? service.description : '-'
      }`,
      skipKeyboard,
    );

    return ctx.wizard.selectStep(0);
  },
  async (ctx) => {
    const { serviceId } = ctx.wizard.state;
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

module.exports = { creationScene, serviceScene, creationServiceScene };
