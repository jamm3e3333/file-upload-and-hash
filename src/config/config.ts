import { createLoader, safeValues, values } from 'configuru'
import { Level } from 'pino'

const loader = createLoader({
  defaultConfigPath: '.env.json',
})

const configSchema = {
  server: {
    port: loader.number('PORT'),
    nodeEnv: loader.custom(x => x as 'development' | 'production')('NODE_ENV'),
  },
  enableTests: loader.bool('ENABLE_TESTS'),
  logger: {
    defaultLevel: loader.custom(x => x as Level)('LOGGER_DEFAULT_LEVEL'),
    pretty: loader.bool('LOGGER_PRETTY'),
  },
  authentication: {
    jwtSecret: loader.string.hidden('JWT_SECRET'),
    tokenExpiresIn: 3600 * 24, // 1 day
  },
  database: {
    user: loader.string('DATABASE_USER'),
    password: loader.string('DATABASE_PASSWORD'),
    name: loader.string('DATABASE_NAME'),
    host: loader.string('DATABASE_HOST'),
    port: loader.number('DATABASE_PORT'),
    minConnections: loader.number('DATABASE_CONNECTION_POOL_SIZE_MIN'),
    acquireTimeoutMillis: loader.number('DATABASE_ACQUIRE_TIMEOUT_MILLIS'),
  },
}

export default values(configSchema)
export const safeConfig = safeValues(configSchema)
