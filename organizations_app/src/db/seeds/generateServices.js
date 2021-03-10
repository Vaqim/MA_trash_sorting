exports.seed = async function (knex) {
  const res = await knex.select('id').from('organizations')
  const servicesData = res.map((organization) => {
    return {price: 10, name: 'Double Dirty MakMak', description: 'Just Awesome!', organization_id: organization.id}
  })
  return knex('services')
    .del()
    .then(() => {
      return knex('services').insert(servicesData);
    });
}; 