exports.up = async (knex) => {
  await knex.raw('create extension if not exists "uuid-ossp"');
  await knex.schema.createTable('services', (table) => {
    table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary();
    table.decimal('price').notNullable();
    table.string('name').notNullable();
    table.string('description').nullable();
    table.uuid('organization_id').references('organizations.id');
    table.timestamp('deleted_at').nullable().defaultTo(null);
    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('services');
  await knex.raw('drop extension if exists "uuid-ossp"');
};
