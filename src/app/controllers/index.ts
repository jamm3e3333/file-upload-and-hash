import * as createCors from 'cors'
import { Request, RequestHandler, Response, Router } from 'express'
import { defaults } from 'lodash'
import * as utils from '../utils'
import { authenticateToken, getBearerToken } from '../services/jwtService'
import * as openapi from '../../openapi-gen'
import * as fileRepository from '../repositories/fileRepository'

const pipeMiddleware = (...middlewares: RequestHandler[]) => {
  const router = Router({ mergeParams: true })
  middlewares.forEach(middleware => router.use(middleware))
  return router
}

/* eslint-disable @typescript-eslint/no-misused-promises */
const bindMiddleware: RequestHandler = async (req, res, next) => {
  try {
    req.context = await createHttpCtx({ req, res })
    next()
  } catch (error) {
    next(error)
  }
}
/* eslint-enable @typescript-eslint/no-misused-promises */

export type HttpContext = utils.Unpromise<ReturnType<typeof createHttpCtx>>

export type HttpContextTyped<TOpenAPIRoute, TMethod extends string = 'post'> = {
  requestBody: openapi.OpenAPIRouteRequestBody<TOpenAPIRoute, TMethod>
  param: openapi.OpenAPIRouteParam<TOpenAPIRoute> extends Record<string, any>
    ? openapi.OpenAPIRouteParam<TOpenAPIRoute>
    : Record<string, string>
} & Pick<HttpContext, 'authenticated' | 'baseUrl' | 'user'>

const getBaseUrl = (req: Request) => {
  return `${req.protocol}://${req.get('hostname') ?? ''}`
}

const createHttpCtx = async (httpContext: { req: Request; res: Response }) => {
  const { req } = httpContext
  const user = req.headers.authorization
    ? await authenticateToken(getBearerToken(req.headers.authorization))
    : undefined
  const authenticated = !(user == null)

  return {
    user,
    authenticated,
    param: defaults({}, req.headers, req.params, req.query) as {
      [key: string]: string
    },
    requestBody: req.body,
    baseUrl: getBaseUrl(req),
  }
}

export const getContextTyped = <TOpenAPIRoute, TMethod extends string = 'post'>(
  context: any
) => {
  return context as HttpContextTyped<TOpenAPIRoute, TMethod>
}

export const securityHandlerForOas = async (req: Request) => {
  const user = req.headers.authorization
    ? await authenticateToken(getBearerToken(req.headers.authorization))
    : undefined
  req.user = user
  return !!user
}

type ServiceHandler = <Route, Method extends string = 'post'>(
  context: HttpContextTyped<Route, Method>
) => PromiseLike<any>

export const service = (
  serviceHandler: ServiceHandler,
  options = { noContent: false }
) =>
  /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
  pipeMiddleware(bindMiddleware, async (req, res, next) => {
    try {
      const responseBody = await serviceHandler(req.context)

      if (options.noContent) {
        res.statusCode = 204
        return res.json(null)
      }
      res.json(responseBody)
    } catch (error) {
      next(error)
    }
  })

export type FileFromContext = Express.Multer.File &
  Pick<fileRepository.File, 'sha1Hash'>

export type FilesForServiceHandler =
  | FileFromContext
  | FileFromContext[]
  | { [key: string]: FileFromContext[] }
  | []

export type FileUploadServiceHandler =
  | ServiceHandler
  | ((context: HttpContext, files: FilesForServiceHandler) => Promise<any>)

export const serviceUploadfile = (
  serviceHandler: FileUploadServiceHandler,
  options = { noContent: false }
) =>
  /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
  pipeMiddleware(bindMiddleware, async (req, res, next) => {
    const files = req?.files?.length ? req?.files : req?.file ?? []
    try {
      const responseBody = await serviceHandler(
        req.context,
        files as FilesForServiceHandler
      )
      if (options.noContent) {
        res.statusCode = 204
        return res.json(null)
      }
      return res.json(responseBody)
    } catch (error) {
      next(error)
    }
  })

export const httpRootHandler: RequestHandler = (_req, res, _next) => {
  res.status(200).send('Hello')
}
export const httpFinalHandler: RequestHandler = (req, res, _next) => {
  res.status(404)
  res.send({
    404: 'Not Found',
    request: req.originalUrl,
  })
}

export const cors = createCors({})
