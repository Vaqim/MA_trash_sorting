exports.up = async (knex) => {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await knex.schema.createTable('recievers', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.integer('telegram_id').unique().notNullable();
    table.string('login').unique().notNullable();
    table.string('password').notNullable();
    table.string('address').notNullable().unique();
    table.string('phone', 13).notNullable();
  });

  await knex.schema.createTable('trash_types', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.string('name').notNullable();
    table.decimal('modifier').notNullable().unsigned();
    table.uuid('reciever_id').references('recievers.id').notNullable();
    table.unique(['name', 'reciever_id'], 'uniq_recievers_trash_types');
    table.timestamp('deleted_at').nullable().defaultTo(null);
    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('trash_types');
  await knex.schema.dropTable('recievers');
  await knex.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
};
