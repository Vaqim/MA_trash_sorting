const { Markup } = require('telegraf');
const { orgKeyboard, skipKeyboard } = require('./keyboards');
const deleteMessage = require('../../utils/deleteMessage');
const logger = require('../../logger')(__filename);
const api = require('../api');

async function changeOrganizationStart(ctx) {
  try {
    const message = await ctx.reply(
      `Введіть назву, якщо хочете пропустити натисніть на кнопку:`,
      skipKeyboard,
    );

    ctx.wizard.state.updateOrganization = {};

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  } catch (error) {
    logger.warn(error);
    await ctx.reply('Сталася помилка, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function changeOrganizationPhone(ctx) {
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
    await ctx.reply('Сталася помилка, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function changeOrganizationAddress(ctx) {
  try {
    const { mainMessage } = ctx.wizard.state;
    const { message_id: messageId } = mainMessage;
    const { id: chatId } = mainMessage.chat;

    if (ctx.message) ctx.wizard.state.updateOrganization.phone = ctx.message.text;
    ctx.telegram.editMessageReplyMarkup(chatId, messageId);

    const message = await ctx.reply(`Адреса:`, skipKeyboard);

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  } catch (error) {
    logger.warn(error);
    await ctx.reply('Сталася помилка, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function changeOrganizationEnd(ctx) {
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

      ctx.wizard.state.mainMessage = await ctx.reply(
        `Організація змінена!\nНазва: ${organization.name}\nТелефон: ${organization.phone}\nАдреса: ${organization.address}`,
        orgKeyboard,
      );
    } else {
      ctx.wizard.state.mainMessage = await ctx.reply(`Зміни не були внесені`, orgKeyboard);
    }

    return ctx.scene.leave();
  } catch (error) {
    logger.warn(error);
    await ctx.reply('Не вдалося змінити організацію, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function changeServiceStart(ctx) {
  try {
    const { id } = ctx.from;
    const { mainMessage } = ctx.wizard.state;

    const data = await api.get(`/organization/${id}/services`);

    const buttons = data.map((service) => {
      return [Markup.button.callback(service.name, `info ${service.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply('Здається у вас поки що немає сервісів, спочатку створіть їх', orgKeyboard);
      return ctx.scene.leave();
    }

    buttons.push([Markup.button.callback('Выйти', `leave`)]);
    if (mainMessage) {
      ctx.editMessageText(
        'Оберіть сервіс, який ви хочете змінити:',
        Markup.inlineKeyboard(buttons),
      );

      ctx.answerCbQuery();
      return ctx.wizard.next();
    }

    const message = await ctx.reply(
      'Оберіть сервіс, який ви хочете змінити:',
      Markup.inlineKeyboard(buttons),
    );

    ctx.wizard.state.mainMessage = message;
    return ctx.wizard.next();
  } catch (error) {
    logger.warn(error);
    await ctx.reply('Не вдалося отримати сервіси, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function changeServiceName(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const { mainMessage } = ctx.wizard.state;
    if (data === 'leave') return deleteMessage(ctx, mainMessage.id, orgKeyboard);
    const serviceId = data.split(' ')[1];

    ctx.wizard.state.updateService = {};
    ctx.wizard.state.serviceId = serviceId;
    ctx.answerCbQuery();
    const message = await ctx.editMessageText(
      `Почнемо! Тепер я буду питати що змінити\nЯкщо не хочеш міняти цей пункт просто натисни на кнопку\nНазва:`,
      skipKeyboard,
    );

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  } catch (error) {
    logger.warn(error);
    await ctx.reply('Сталася помилка, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function changeServicePrice(ctx) {
  try {
    const { mainMessage } = ctx.wizard.state;
    const { message_id: messageId } = mainMessage;
    const { id: chatId } = mainMessage.chat;

    if (ctx.message) ctx.wizard.state.updateService.name = ctx.message.text;
    ctx.telegram.editMessageReplyMarkup(chatId, messageId);

    const message = await ctx.reply(`Ціна:`, skipKeyboard);

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  } catch (error) {
    logger.warn(error);
    await ctx.reply('Сталася помилка, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function changeServiceDesc(ctx) {
  try {
    const { mainMessage } = ctx.wizard.state;
    const { message_id: messageId } = mainMessage;
    const { id: chatId } = mainMessage.chat;

    if (ctx.message) ctx.wizard.state.updateService.price = ctx.message.text;
    ctx.telegram.editMessageReplyMarkup(chatId, messageId);

    const message = await ctx.reply(`Опис:`, skipKeyboard);

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  } catch (error) {
    logger.warn(error);
    await ctx.reply('Сталася помилка, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function changeServiceEnd(ctx) {
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
        `Сервіс змінений!\nНазва: ${service.name}\nЦіна: ${service.price}\nОпис: ${service.description}`,
        skipKeyboard,
      );
    } else {
      ctx.wizard.state.mainMessage = await ctx.reply(`Зміни не були внесені`, skipKeyboard);
    }

    return ctx.wizard.selectStep(0);
  } catch (error) {
    logger.warn(error);
    await ctx.reply('Не вдалося змінити сервіс, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function getServices(ctx) {
  try {
    const { id } = ctx.from;
    const { mainMessage } = ctx.wizard.state;

    const data = await api.get(`/organization/${id}/services`);

    const buttons = data.map((service) => {
      return [Markup.button.callback(service.name, `info ${service.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply('Здається у вас поки що немає сервісів, спочатку створіть їх', orgKeyboard);
      return ctx.scene.leave();
    }

    buttons.push([Markup.button.callback('Выйти', `leave`)]);
    if (mainMessage) {
      await ctx.editMessageText(
        'Оберіть сервіс, який хочете переглянути:',
        Markup.inlineKeyboard(buttons),
      );

      ctx.answerCbQuery();
      return ctx.wizard.next();
    }

    const message = await ctx.reply(
      'Оберіть сервіс, який хочете переглянути::',
      Markup.inlineKeyboard(buttons),
    );

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  } catch (error) {
    logger.warn(error);
    await ctx.reply('Не вдалося отримати сервіси, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function getServiceInfo(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const { mainMessage } = ctx.wizard.state;
    if (data === 'leave') return deleteMessage(ctx, mainMessage.id, orgKeyboard);
    const serviceId = data.split(' ')[1];
    const service = await api.get(`/organization/services/${serviceId}`);

    await ctx.editMessageText(
      `Назва: ${service.name}\nЦiна: ${service.price}\nОпис: ${
        service.description ? service.description : '-'
      }`,
      skipKeyboard,
    );

    return ctx.wizard.selectStep(0);
  } catch (error) {
    logger.warn(error);
    await ctx.reply('Не вдалося отримати сервіси, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function deleteServiceStart(ctx) {
  try {
    const { id } = ctx.from;
    const { mainMessage } = ctx.wizard.state;
    const data = await api.get(`/organization/${id}/services`);

    const buttons = data.map((service) => {
      return [Markup.button.callback(service.name, `delete ${service.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply('Здається у вас поки що немає сервісів, спочатку створіть їх', orgKeyboard);
      return ctx.scene.leave();
    }

    buttons.push([Markup.button.callback('Вийти', `leave`)]);

    if (mainMessage) {
      await ctx.editMessageText(
        'Оберіть сервіс, який хочете видалити:',
        Markup.inlineKeyboard(buttons),
      );

      return ctx.wizard.next();
    }

    const message = await ctx.reply(
      'Оберіть сервіс, який хочете видалити:',
      Markup.inlineKeyboard(buttons),
    );
    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  } catch (error) {
    logger.warn(error);
    await ctx.reply('Не вдалося отримати сервіси, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function deleteServiceEnd(ctx) {
  try {
    const { mainMessage } = ctx.wizard.state;
    const { data } = ctx.update.callback_query;
    if (data === 'leave') return deleteMessage(ctx, mainMessage.id, orgKeyboard);
    const serviceId = data.split(' ')[1];

    await api.del(`/organization/services/${serviceId}`);
    ctx.answerCbQuery();
    await ctx.editMessageText(`Сервіс успішно вилучено!`, skipKeyboard);

    return ctx.wizard.selectStep(0);
  } catch (error) {
    logger.warn(error);
    await ctx.reply('Не вдалося отримати сервіси, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function setServiceName(ctx) {
  try {
    ctx.wizard.state.creationData = {};
    await ctx.reply('Назва вашого сервісу:');
    return ctx.wizard.next();
  } catch (error) {
    logger.error(error);
    await ctx.reply('Сталася помилка, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function setServicePrice(ctx) {
  try {
    ctx.wizard.state.creationData.name = ctx.message.text;
    await ctx.reply('Тепер вкажіть ціну в балах:');
    return ctx.wizard.next();
  } catch (error) {
    logger.error(error);
    await ctx.reply('Сталася помилка, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function setServiceDesc(ctx) {
  try {
    ctx.wizard.state.creationData.price = ctx.message.text;
    const message = await ctx.reply(
      'Останній крок!\nНапишіть короткий опис (ви можете пропустити цей крок натиснувши на кнопку):',
      skipKeyboard,
    );

    ctx.wizard.state.cbMessage = message;
    return ctx.wizard.next();
  } catch (error) {
    logger.error(error);
    await ctx.reply('Сталася помилка, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

async function createServiceEnd(ctx) {
  try {
    const { cbMessage } = ctx.wizard.state;
    if (ctx.message) ctx.wizard.state.creationData.description = ctx.message.text;
    ctx.telegram.editMessageReplyMarkup(cbMessage.chat.id, cbMessage.message_id);
    ctx.wizard.state.creationData.organizationId = ctx.from.id;

    const data = await api.post('/organization/services', ctx.wizard.state.creationData);
    await ctx.reply(
      `Так, сервіс створений:\nНазва: ${data.name}\nЦiна: ${data.price}\nОпис: ${
        data.description ? data.description : '-'
      }`,
      orgKeyboard,
    );
    return ctx.scene.leave();
  } catch (error) {
    logger.warn(error);
    await ctx.reply('Не вдалося отримати сервіси, спробуйте пізніше', orgKeyboard);
    return ctx.scene.leave();
  }
}

const changeOrganization = [
  changeOrganizationStart,
  changeOrganizationPhone,
  changeOrganizationAddress,
  changeOrganizationEnd,
];
const changeService = [
  changeServiceStart,
  changeServiceName,
  changeServicePrice,
  changeServiceDesc,
  changeServiceEnd,
];
const servicesInfo = [getServices, getServiceInfo];
const deleteService = [deleteServiceStart, deleteServiceEnd];
const createService = [setServiceName, setServicePrice, setServiceDesc, createServiceEnd];

module.exports = { changeOrganization, changeService, servicesInfo, deleteService, createService };
