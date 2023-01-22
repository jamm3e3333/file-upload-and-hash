/* eslint-disable @typescript-eslint/no-var-requires */
import * as utils from '../utils'
import config from '../../config'
import * as knex from 'knex'

export const knexConfig: knex.Knex.Config = applySnakes({
  client: 'pg',
  connection: {
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    database: config.database.name,
    password: config.database.password,
  },
  pool: {
    min: config.database.minConnections,
    createTimeoutMillis: 8000,
    acquireTimeoutMillis: config.database.acquireTimeoutMillis,
    idleTimeoutMillis: 8000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
})

export const connect = () => {
  // eslint-disable-next-line new-cap
  const client = knex.knex(knexConfig)
  const conn = {
    knex: client,
    knexConfig,
  }
  connection = conn
  return conn
}

let connection: Connection

export const getKnex = () => connection.knex

type Connection = utils.Unpromise<ReturnType<typeof connect>>

function applySnakes(knexOptions: knex.Knex.Config): knex.Knex.Config {
  return require('knex-stringcase')(knexOptions)
}

export const updateTimestampOnUpdate = async (
  knex: knex.Knex,
  table: string,
  column: string
) => {
  const psqlFnRaw = `
        CREATE OR REPLACE FUNCTION on_update_timestamp()
        RETURNS trigger AS $$
        BEGIN
        NEW.${column} = now();
        RETURN NEW;
        END;
        $$ language 'plpgsql';
    `
  await knex.raw(psqlFnRaw)
  const onUpdateTrigger = (table: string) => `
        CREATE TRIGGER ${table}_${column}
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE PROCEDURE on_update_timestamp();
    `
  await knex.raw(onUpdateTrigger(table))
}
