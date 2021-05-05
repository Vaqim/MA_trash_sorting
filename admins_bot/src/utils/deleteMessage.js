async function deleteMessage(ctx, messageId, keyboard) {
  await ctx.deleteMessage(messageId);
  await ctx.reply('Выберите действие', keyboard);
  return ctx.scene.leave();
}

module.exports = deleteMessage;
