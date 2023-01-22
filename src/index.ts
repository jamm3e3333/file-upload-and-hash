import 'source-map-support/register'
import logger from './app/logger'
import server from './server'
import config, { safeConfig } from './config'
import * as db from './app/database'

logger.info(safeConfig, 'Loaded config')

db.connect()

server.listen(config.server.port, () => {
  logger.info(`Server started on port ${config.server.port}`)
})
