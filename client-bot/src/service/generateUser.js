function generateUser(obj) {
  return {
    telegram_id: obj.from.id,
    login: obj.from.username,
    userType: 'client',
  };
}

module.exports = generateUser;
