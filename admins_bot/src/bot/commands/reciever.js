const { Markup } = require('telegraf');
const { recKeyboard, skipKeyboard } = require('./keyboards');
const deleteMessage = require('../../utils/deleteMessage');
const logger = require('../../logger')(__filename);
const api = require('../api');

async function setTrashTypeName(ctx) {
  try {
    ctx.wizard.state.creationData = {};
    await ctx.reply('Введіть назву: ');
    return ctx.wizard.next();
  } catch (error) {
    logger.error(error);
    await ctx.reply('Сталася помилка, спробуйте пізніше', recKeyboard);
    return ctx.scene.leave();
  }
}

async function setTrashTypeModifier(ctx) {
  try {
    ctx.wizard.state.creationData.name = ctx.message.text;
    await ctx.reply('Вкажіть коефіцієнт вартості: ');
    return ctx.wizard.next();
  } catch (error) {
    logger.error(error);
    await ctx.reply('Сталася помилка, спробуйте пізніше', recKeyboard);
    return ctx.scene.leave();
  }
}

async function createTrashTypeEnd(ctx) {
  try {
    ctx.wizard.state.creationData.modifier = +ctx.message.text;
    ctx.wizard.state.creationData.telegram_id = ctx.message.from.id;

    const data = await api.post(
      `/recievers/${ctx.message.from.id}/trash_types`,
      ctx.wizard.state.creationData,
    );
    logger.debug('new trash type', data);
    await ctx.reply(
      `Ви створили новий тип сміття\nНазва: ${data.name}\nКоефіцієнт: ${data.modifier}`,
      recKeyboard,
    );
    return ctx.scene.leave();
  } catch (error) {
    logger.error(error);
    await ctx.reply('Не вдалося створити тип сміття, спробуйте пізніше', recKeyboard);
    return ctx.scene.leave();
  }
}

async function getTrashTypes(ctx) {
  try {
    const { id } = ctx.from;
    const { mainMessage } = ctx.wizard.state;

    const data = await api.get(`/recievers/${id}/trash_types`);

    const buttons = data.map((trash) => {
      return [Markup.button.callback(trash.name, `info ${trash.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply(
        'Здається у вас поки що немає типiв смiття, спочатку створіть їх',
        recKeyboard,
      );
      return ctx.scene.leave();
    }

    buttons.push([Markup.button.callback('Выйти', `leave`)]);
    if (mainMessage) {
      await ctx.editMessageText(
        'Оберіть позицію, яку хочете переглянути:',
        Markup.inlineKeyboard(buttons),
      );

      ctx.answerCbQuery();
      return ctx.wizard.next();
    }

    const message = await ctx.reply(
      'Оберіть позицію, яку хочете переглянути:',
      Markup.inlineKeyboard(buttons),
    );

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  } catch (error) {
    logger.error(error);
    await ctx.reply('Не вдалося отримати типи сміття, спробуйте пізніше', recKeyboard);
    return ctx.scene.leave();
  }
}

async function getTrashTypeInfo(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const { mainMessage } = ctx.wizard.state;
    if (data === 'leave') return deleteMessage(ctx, mainMessage.id, recKeyboard);
    const trashId = data.split(' ')[1];
    const trashType = await api.get(`/trash_types/${trashId}`);

    await ctx.editMessageText(
      `Тип: ${trashType.name}\nКоефіцієнт: ${trashType.modifier}`,
      skipKeyboard,
    );

    return ctx.wizard.selectStep(0);
  } catch (error) {
    logger.error(error);
    await ctx.reply('Не удалось создать тип мусора, попробуйте позже', recKeyboard);
    return ctx.scene.leave();
  }
}

async function changeTrashTypeStart(ctx) {
  try {
    const { id } = ctx.from;
    const { mainMessage } = ctx.wizard.state;

    const data = await api.get(`/recievers/${id}/trash_types`);

    const buttons = data.map((type) => {
      return [Markup.button.callback(type.name, `info ${type.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply(
        'Здається у вас поки що немає типів сміття, спочатку створіть їх',
        recKeyboard,
      );
      return ctx.scene.leave();
    }

    buttons.push([Markup.button.callback('Выйти', `leave`)]);
    if (mainMessage) {
      ctx.editMessageText('Оберіть тип, який ви хочете змінити:', Markup.inlineKeyboard(buttons));

      ctx.answerCbQuery();
      return ctx.wizard.next();
    }

    const message = await ctx.reply(
      'Оберіть тип, який ви хочете змінити:',
      Markup.inlineKeyboard(buttons),
    );

    ctx.wizard.state.mainMessage = message;
    return ctx.wizard.next();
  } catch (error) {
    logger.error(error);
    await ctx.reply('Не вдалося отримати типи сміття, спробуйте пізніше', recKeyboard);
    return ctx.scene.leave();
  }
}

async function changeTrashTypeName(ctx) {
  try {
    const { data } = ctx.update.callback_query;
    const { mainMessage } = ctx.wizard.state;
    if (data === 'leave') return deleteMessage(ctx, mainMessage.id, recKeyboard);
    const trashTypeId = data.split(' ')[1];

    ctx.wizard.state.updateTrashType = {};
    ctx.wizard.state.trashTypeId = trashTypeId;
    ctx.answerCbQuery();
    const message = await ctx.reply(
      `Почнемо! Тепер я буду питати що змінити\nЯкщо не хочеш міняти цей пункт просто натисни на кнопку\nНазва:`,
      skipKeyboard,
    );

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  } catch (error) {
    logger.error(error);
    await ctx.reply('Сталася помилка, спробуйте пізніше', recKeyboard);
    return ctx.scene.leave();
  }
}

async function changeTrashTypeModifier(ctx) {
  try {
    const { mainMessage } = ctx.wizard.state;
    const { message_id: messageId } = mainMessage;
    const { id: chatId } = mainMessage.chat;

    if (ctx.message) ctx.wizard.state.updateTrashType.name = ctx.message.text;
    ctx.telegram.editMessageReplyMarkup(chatId, messageId);

    const message = await ctx.reply(`Коефіцієнт:`, skipKeyboard);

    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  } catch (error) {
    logger.error(error);
    await ctx.reply('Сталася помилка, спробуйте пізніше', recKeyboard);
    return ctx.scene.leave();
  }
}

async function changeTrashTypeEnd(ctx) {
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
        `Тип змінений!\nНазва: ${trashType.name}\nКоефіцієнт: ${trashType.modifier}`,
        skipKeyboard,
      );
    } else {
      ctx.wizard.state.mainMessage = await ctx.reply(`Зміни не були внесені`, skipKeyboard);
    }

    return ctx.wizard.selectStep(0);
  } catch (error) {
    logger.error(error);
    await ctx.reply('Не вдалося змінити тип сміття, спробуйте пізніше', recKeyboard);
    return ctx.scene.leave();
  }
}

async function deleteTrashTypeStart(ctx) {
  try {
    const { id } = ctx.from;
    const { mainMessage } = ctx.wizard.state;
    const data = await api.get(`recievers/${id}/trash_types`);

    const buttons = data.map((trash) => {
      return [Markup.button.callback(trash.name, `delete ${trash.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply(
        'Здається у вас поки що немає типiв смiття, спочатку створіть їх',
        recKeyboard,
      );
      return ctx.scene.leave();
    }

    buttons.push([Markup.button.callback('Выйти', `leave`)]);

    if (mainMessage) {
      await ctx.editMessageText(
        'Оберіть тип, який хочете видалити:',
        Markup.inlineKeyboard(buttons),
      );

      return ctx.wizard.next();
    }

    const message = await ctx.reply(
      'Оберіть тип, який хочете видалити:',
      Markup.inlineKeyboard(buttons),
    );
    ctx.wizard.state.mainMessage = message;

    return ctx.wizard.next();
  } catch (error) {
    logger.error(error);
    await ctx.reply('Не вдалося отримати типи сміття, спробуйте пізніше', recKeyboard);
    return ctx.scene.leave();
  }
}

async function deleteTrashTypeEnd(ctx) {
  try {
    const { mainMessage } = ctx.wizard.state;
    const { data } = ctx.update.callback_query;
    if (data === 'leave') return deleteMessage(ctx, mainMessage.id, recKeyboard);
    const trashId = data.split(' ')[1];

    await api.del(`/trash_types/${trashId}`);
    ctx.answerCbQuery();
    await ctx.editMessageText(`Тип сміття успішно вилучено!`, skipKeyboard);

    return ctx.wizard.selectStep(0);
  } catch (error) {
    logger.error(error);
    await ctx.reply('Не вдалося видалити тип сміття, спробуйте пізніше', recKeyboard);
    return ctx.scene.leave();
  }
}

async function choosingTrashTypes(ctx) {
  try {
    const { id } = ctx.from;
    const { trash } = ctx.wizard.state;
    const data = await api.get(`recievers/${id}/trash_types`);

    const buttons = data.map((trashType) => {
      return [Markup.button.callback(trashType.name, `add ${trashType.id}`)];
    });

    if (!buttons.length) {
      await ctx.reply(
        'Здається у вас поки що немає типiв смiття, спочатку створіть їх',
        recKeyboard,
      );
      return ctx.scene.leave();
    }

    buttons.push([
      Markup.button.callback('Розрахувати', `calculate`),
      Markup.button.callback('Вийти', `leave`),
    ]);

    const message = await ctx.reply(
      'Оберіть тип сміття, якщо ви закінчили додавати сміття натисніть "Розрахувати"',
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
    await ctx.reply('Не вдалося отримати типи сміття, спробуйте пізніше', recKeyboard);
    return ctx.scene.leave();
  }
}

async function setTrashWeightOrCalculatePoints(ctx) {
  try {
    const { mainMessage } = ctx.wizard.state;
    const { data } = ctx.update.callback_query;
    if (data === 'leave') return deleteMessage(ctx, mainMessage.id, recKeyboard);
    if (data === 'calculate') {
      try {
        const { trashTypes } = ctx.wizard.state;
        const points = await api.post(`/points/calculate`, trashTypes);
        await ctx.reply(
          `Кількість балів: ${points.points}\nВведіть нік користувача, якому хочете нарахувати бали`,
        );

        ctx.wizard.state.points = points.points;
        return ctx.wizard.next();
      } catch (error) {
        logger.error(error);
        await ctx.reply('Не вдалося розрахувати тип сміття', recKeyboard);
        return ctx.scene.leave();
      }
    }
    try {
      const trashId = data.split(' ')[1];

      const trashType = await api.get(`/trash_types/${trashId}`);

      ctx.wizard.state.trash = { name: trashType.name, modifier: trashType.modifier };

      await ctx.reply('Введіть вагу сміття в кг');

      return ctx.wizard.selectStep(0);
    } catch (error) {
      logger.error(error);
      await ctx.reply('Не вдалося знайти тип сміття, спробуйте пізніше', recKeyboard);
      return ctx.scene.leave();
    }
  } catch (error) {
    logger.error(error);
    await ctx.reply('Сталася помилка, спробуйте пізніше', recKeyboard);
    return ctx.scene.leave();
  }
}

async function addPoints(ctx) {
  try {
    const { points } = ctx.wizard.state;

    await api.post(`/points/add`, { login: ctx.message.text, pointsAmount: points });

    await ctx.reply('Бали успішно нараховані', recKeyboard);

    return ctx.scene.leave();
  } catch (error) {
    logger.error(error);
    await ctx.reply('Не вдалося нарахувати бали, спробуйте пізніше', recKeyboard);
    return ctx.scene.leave();
  }
}

const createTrashType = [setTrashTypeName, setTrashTypeModifier, createTrashTypeEnd];
const trashTypesInfo = [getTrashTypes, getTrashTypeInfo];
const changeTrashType = [
  changeTrashTypeStart,
  changeTrashTypeName,
  changeTrashTypeModifier,
  changeTrashTypeEnd,
];
const deleteTrashType = [deleteTrashTypeStart, deleteTrashTypeEnd];
const calculatePoints = [choosingTrashTypes, setTrashWeightOrCalculatePoints, addPoints];
module.exports = {
  createTrashType,
  trashTypesInfo,
  changeTrashType,
  deleteTrashType,
  calculatePoints,
};
