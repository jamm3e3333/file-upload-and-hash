import { Knex } from 'knex'
import * as db from '../app/database'

export const up = async (knex: Knex) => {
  await knex.schema.createTable('users', t => {
    t.bigIncrements('id').primary()
    t.text('name').notNullable().unique()
    t.text('hash').notNullable()
    t.text('salt').notNullable()
    t.timestamp('createTime').notNullable().defaultTo(knex.fn.now())
    t.timestamp('updateTime').notNullable().defaultTo(knex.fn.now())
  })
  await db.updateTimestampOnUpdate(knex, 'users', 'update_time')
}

export const down = (knex: Knex) => knex.schema.dropTable('users')
