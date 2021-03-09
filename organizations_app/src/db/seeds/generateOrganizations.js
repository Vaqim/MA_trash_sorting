exports.seed = function (knex) {
  return knex('organizations')
    .del()
    .then(() => {
      return knex('organizations').insert([
        { login: `McDonalds`, name: `McDonald's`, password: 'McDonalds', phone: '0504639120', adress: 'л. Смелянская, 31, Черкассы, Черкасская область, 18000' },
        { login: `KFC`, name: `KFC`, password: 'KFC', phone: '0504639120', adress: 'бул. Шевченко, 207, Черкассы, Черкасская область, 18000' },
      ]);
    });
};