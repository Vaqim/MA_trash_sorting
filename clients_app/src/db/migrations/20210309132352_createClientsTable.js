exports.up = async (knex) => {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable('clients', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('login').unique().notNullable();
    table.string('name').nullable();
    table.string('password').notNullable();
    table.string('phone', 13).nullable();
    table.decimal('balance').defaultTo('0.0').notNullable().unsigned();
    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('clients');
  await knex.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
};
