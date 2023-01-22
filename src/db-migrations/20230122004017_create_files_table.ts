import { Knex } from 'knex'
import * as db from '../app/database'

export const up = async (knex: Knex) => {
  await knex.schema.createTable('files', t => {
    t.bigIncrements('id').primary()
    t.bigInteger('userId')
      .notNullable()
      .references('users.id')
      .unsigned()
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
    t.text('originalName').notNullable()
    t.text('sizeInBytes')
    t.text('sha1Hash').notNullable()
    t.timestamp('createTime').notNullable().defaultTo(knex.fn.now())
    t.timestamp('updateTime').notNullable().defaultTo(knex.fn.now())
  })
  await db.updateTimestampOnUpdate(knex, 'files', 'update_time')
}

export const down = (knex: Knex) => knex.schema.dropTable('files')
