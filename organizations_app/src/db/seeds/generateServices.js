exports.seed = async function (knex) {
  const organizationIds = knex.select('id').from('organizations')
  const servicesData = organizationIds.map((id) => {
    return {price: 10, name: 'Double Dirty MakMak', description: 'Just Awesome!', organization_id: id}
  })
  return knex('services')
    .del()
    .then(() => {
      return knex('services').insert(servicesData);
    });
};