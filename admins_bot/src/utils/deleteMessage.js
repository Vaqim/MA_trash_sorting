async function deleteMessage(ctx, messageId) {
  await ctx.deleteMessage(messageId);
  return ctx.scene.leave();
}

module.exports = deleteMessage;
