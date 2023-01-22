import logger from '../app/logger'
import config, { safeConfig } from '../config'
import * as db from '../app/database'
import * as setup from './testingSetup'

export default async () => {
  logger.info(safeConfig)
  db.connect()

  if (!config.enableTests) {
    throw Error(
      'Tests are disabled. Please set "ENABLE_TESTS" configuration variable.'
    )
  }

  await setup.resetDatabase()
}
