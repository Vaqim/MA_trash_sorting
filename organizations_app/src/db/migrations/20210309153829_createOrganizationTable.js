exports.up = async (knex) => {
  await knex.raw('create extension if not exists "uuid-ossp"');
  await knex.schema.createTable('organizations', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('login').unique().notNullable();
    table.string('name').nullable();
    table.string('password').notNullable();
    table.string('phone', 13).nullable();
    table.string('address').nullable();
    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('services');
  await knex.raw('drop extension if exists "uuid-ossp"');
};
