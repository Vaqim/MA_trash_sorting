exports.seed = async (knex) => {
  await knex('trash_types').del();
  await knex('recievers').del();

  await knex('recievers').insert([
    { login: 'vaqim', password: '1111', address: 'testAddress1', phone: '145123' },
    { login: 'vlad', password: '1111', address: 'testAddress2', phone: '145124' },
    { login: 'toha', password: '1111', address: 'testAddress3', phone: '145125' },
  ]);

  await knex('trash_types').insert({
    name: 'glass',
    modifier: '0.5',
    reciever_id: knex.raw(`(select id from recievers where login = 'vaqim')`),
  });
};
