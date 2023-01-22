import * as db from '../app/database'
export * from './testing'
jest.setTimeout(10000)

db.connect()

afterAll(async () => {
  await db.getKnex().destroy()
})
