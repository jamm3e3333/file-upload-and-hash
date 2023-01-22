import * as db from '../app/database'

export const resetDatabase = async () => {
  const tables = (
    await db
      .getKnex()
      .raw<{ rows: Array<{ tablename: string }> }>(
        "SELECT tablename FROM pg_tables WHERE schemaname = 'public';"
      )
  ).rows
    .map(row => row.tablename)
    .filter(
      table =>
        ![
          // Migrations
          'knex_migrations',
          'knex_migrations_lock',
          'spatial_ref_sys', // needed by PostGIS -- spatial reference systems,
        ].includes(table)
    )
  if (tables.length > 0) {
    await db.getKnex().raw(`TRUNCATE ${tables.join(', ')}`)
  }
}
