import { getKnex } from '../database'
import { E_CODES } from '../errors'
import { ValidationError } from '../errors/classes'

export interface User {
  id: string
  name: string
  hash: string
  salt: string
  createTime?: Date
  updateTime?: Date
}

const getUserForName = (user: Pick<User, 'name'>) =>
  getKnex()('users').where('name', user.name).first()

const getUserForId = (user: Pick<User, 'id'>) =>
  getKnex()('users').where('id', user.id).first()

const createUser = async (user: Pick<User, 'name' | 'hash' | 'salt'>) => {
  const existingUser = await getUserForName({ name: user.name })
  if (existingUser) {
    throw new ValidationError(E_CODES.U4000)
  }
  const [createdUser] = await getKnex()('users').insert(user).returning('*')
  return createdUser
}

export { getUserForName, createUser, getUserForId }
