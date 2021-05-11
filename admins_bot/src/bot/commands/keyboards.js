const { Markup } = require('telegraf');

const orgKeyboard = Markup.keyboard([
  'Просмотреть сервисы',
  'Создать сервисы',
  'Удалить сервисы',
  'Изменить сервисы',
  'Изменить организацию',
])
  .resize()
  .oneTime();

const recKeyboard = Markup.keyboard([
  'Просмотреть позиции',
  'Создать позиции',
  'Изменить позиции',
  'Удалить позиции',
  'Начислить баллы',
])
  .resize()
  .oneTime();

const skipKeyboard = Markup.inlineKeyboard([Markup.button.callback('Продолжить', 'skip')]);

module.exports = { orgKeyboard, recKeyboard, skipKeyboard };
