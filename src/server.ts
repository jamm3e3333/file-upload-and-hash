import * as express from 'express'
import * as ctrl from './app/controllers'
import * as userService from './app/services/userService'
import * as fileService from './app/services/fileService'
import * as swaggerUi from 'swagger-ui-express'
import * as OpenApiValidator from 'express-openapi-validator'
import logger from './app/logger'
import httpErrorResponder from './app/controllers/httpErrorResponder'
import { FileUploadEngine } from './app/services/fileUploadEngineService'
const oasJsonDoc = require('../docs/api/generated/openapi.json')

const validator = OpenApiValidator.middleware({
  apiSpec: './docs/api/openapi.yaml',
  ignorePaths: /(\/{1}$)|(\/api\/v1\/docs)/,
  fileUploader: {
    storage: new FileUploadEngine(),
  },
  validateSecurity: {
    handlers: {
      bearer(req, scopes: string[]) {
        return ctrl.securityHandlerForOas(req)
      },
    },
  },
})

const server = express()
server.use(express.json())
server.use(ctrl.cors)
server.use(logger.express)
server.use(validator)

server.all('/', ctrl.httpRootHandler)
server.post('/api/v1/users', ctrl.service(userService.handlePostUser))
server.post('/api/v1/sessions', ctrl.service(userService.handlePostSession))

server.post(
  '/api/v1/uploads',
  ctrl.serviceUploadfile(fileService.handleFileUpload)
)

server.use('/api/v1/docs', swaggerUi.serve)
server.get('/api/v1/docs', swaggerUi.setup(oasJsonDoc))

server.use(httpErrorResponder)
server.use(ctrl.httpFinalHandler)

export default server
