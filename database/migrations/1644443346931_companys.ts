import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Companys extends BaseSchema {
  protected tableName = 'companies'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer("id_user")
        .unsigned()
        .notNullable()
        .references("users.id")
        .onDelete("CASCADE")
      table.string('name').notNullable()
      table.string('cnpj', 14).notNullable()
      table.string('logo')
      table.string('address').notNullable()
      table.string('whatsapp', 11).notNullable()
      table.string('instagram')
      table.boolean('published').notNullable().defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
