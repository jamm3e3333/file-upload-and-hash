import * as openapi from '../../openapi-gen'
import * as ctrl from '../controllers'
import * as utils from '../utils'
import * as jwt from '../services/jwtService'
import * as userRepository from '../repositories/userRepository'
import { NotFound, ValidationError } from '../errors/classes'
import { E_CODES } from '../errors'

const validateUserName = (name: string) => {
  if (name.length < 5) {
    throw new ValidationError(E_CODES.U4001)
  }
}

const validatePassword = (password: string) => {
  if (!utils.validatePassword(password)) {
    throw new ValidationError(E_CODES.U4002)
  }
}

const modifyUserName = (email: string) => email.trim()

export const handlePostUser = async (
  context: any
): Promise<openapi.OpenAPIRouteResponseBody<openapi.paths['/api/v1/users']>> =>
  utils.pipe(
    () => ctrl.getContextTyped<openapi.paths['/api/v1/users']>(context),
    async context => {
      const { name, passwd } = context.requestBody.user

      const password = passwd.trim()
      const userName = modifyUserName(name)

      validateUserName(userName)
      validatePassword(password)

      const { hash, salt } = await utils.hashPassword(password)

      const user = await userRepository.createUser({
        name: userName,
        hash,
        salt,
      })
      const token = jwt.generateToken({
        user: {
          name: userName,
          id: (user as any).id,
        },
      })

      return { token }
    }
  )(context)

export const handlePostSession = (
  context: any
): Promise<
  openapi.OpenAPIRouteResponseBody<openapi.paths['/api/v1/sessions']>
> =>
  utils.pipe(
    () => ctrl.getContextTyped<openapi.paths['/api/v1/sessions']>(context),
    async context => {
      const { name, passwd } = context.requestBody.user

      const userName = modifyUserName(name)
      validateUserName(userName)

      const user = await userRepository.getUserForName({ name: userName })

      if (!user) {
        throw new NotFound()
      }

      await utils.checkPassword({
        password: passwd.trim(),
        hashForCompare: user.hash,
        salt: user.salt,
      })
      const token = jwt.generateToken({
        user: { name: userName, id: user.id },
      })

      return { token }
    }
  )(context)
