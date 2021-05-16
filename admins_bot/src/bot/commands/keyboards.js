const { Markup } = require('telegraf');

const orgKeyboard = Markup.keyboard([
  'Переглянути сервіси',
  'Створити сервіси',
  'Видалити сервіси',
  'Змінити сервіси',
  'Змінити організацію',
])
  .resize()
  .oneTime();

const recKeyboard = Markup.keyboard([
  'Переглянути позиції',
  'Створити позиції',
  'Змінити позиції',
  'Видалити позиції',
  'Нарахувати бали',
])
  .resize()
  .oneTime();

const skipKeyboard = Markup.inlineKeyboard([Markup.button.callback('Продолжить', 'skip')]);

module.exports = { orgKeyboard, recKeyboard, skipKeyboard };
