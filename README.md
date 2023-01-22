# File upload

App for uploading file and calculating the size and the sha1 has file for users

## 📝 API docs

Find the API documentation [here](./docs/api/openapi.yaml) written in swagger, copy the file to [Swagger editor](https://editor.swagger.io/?_ga=2.245618116.1359773802.1671205457-100018630.1670623569).

Or run the application and visit the path `/api/v1/docs` in the browser.

## 🚀 Project setup

1. Install [NodeJS](https://nodejs.org/en/download/) and use the node version according to ['.nvmrc'](./.nvmrc)
2. Install npm dependencies `npm run ci`
3. Run docker container for PostgreSQL or other process of PostgreSQL database
   - for docker make sure you have the [Docker](https://docs.docker.com/get-docker/) and [docker compose](https://docs.docker.com/compose/install/) installed
   - navigate to `docker-compose` directory
   - make sure you have these environemnt variables set 👇 and run `docker-compose up`:

```json
  // this is just an example of env vars
{
  "DATABASE_USER": "postgres",
  "DATABASE_PORT": 5432,
  "DATABASE_PASSWORD": "postgres",
  "DATABASE_NAME": "postgres"
}
```

4. Run migrations `npx knex migrate:latest` with these environment variables:
  
```json
// this is just an example of env vars
{
  "DATABASE_USER": "postgres",
  "DATABASE_HOST": "localhost",
  "DATABASE_PORT": 5432,
  "DATABASE_PASSWORD": "postgres",
  "DATABASE_NAME": "postgres"
}
```

## 🔧 Configuration

To overwrite the default config, create a valid json file from `.env.json`, rewrite the default config and set the `CFG_JSON_PATH` env variable.

E.g.

```json
// This is an example of dotenv-api.json file
{
  "PORT": 3000,
  "NODE_ENV": "development",
  "LOGGER_DEFAULT_LEVEL": "debug",
  "LOGGER_PRETTY": false,
  "JWT_SECRET": "secret",
  "ENABLE_TESTS": false,
  "DATABASE_USER": "postgres",
  "DATABASE_HOST": "localhost",
  "DATABASE_PORT": 5432,
  "DATABASE_PASSWORD": "postgres",
  "DATABASE_NAME": "postgres",
  "DATABASE_CONNECTION_POOL_SIZE_MIN": 0,
  "DATABASE_ACQUIRE_TIMEOUT_MILLIS": 8000
}

```

```bash
export CFG_JSON_PATH=~/secrets/dotenv-api.json
```

## ✨ Start app

To start app, make sure that you have necessary env variables set.

1. Build the app `npm run build`
2. Start app `npm run start`

## 🧪 Run tests

1. Install dependencies `npm run ci`
2. Build the app `npm run build`
3. Set `ENABLE_TESTS` to `true` or `1` and other environemnt variables related to the testing PostgreSQL database

```bash
  export ENABLE_TESTS=1
  export DATABASE_USER=postgres
  export DATABASE_HOST=localhost
  export DATABASE_PORT=5432
  export DATABASE_PASSWORD=postgres
  export DATABASE_NAME=postgres
```

4. Run PostgreSQL testing database
5. Run tests `npm run test`

## 🎨 Code formatting

Check and fix code formatting with `npm run lint-fix`

