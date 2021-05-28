exports.seed = async (knex) => {
  await knex('clients').del();
  await knex('clients').insert([
    { login: 'vaqim', password: '1234' },
    { login: 'vlad', password: '5678' },
    { login: 'toha', password: '9012' },
  ]);
};
