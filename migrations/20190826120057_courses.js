exports.up = function(knex) {
  return knex.schema.createTable('courses', table => {
    table.increments('id').primary()
    table
      .string('name', 120)
      .notNullable()
      .defaultTo('')
    table.string('program', 10).nullable()
    table
      .enum('type', ['graduation', 'specialization', 'master', 'doctorate'])
      .notNullable()
      .defaultTo('graduation')
    table.integer('unityId').unsigned()
    table.foreign('unityId').references('academicUnities.id')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('courses')
}
