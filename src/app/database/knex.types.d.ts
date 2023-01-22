import { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface User {
    id: string
    name: string
    hash: string
    salt: string
    createTime: string
    updateTime: string
  }

  interface File {
    id: string
    userId: string
    originalName: string
    sizeInBytes: string
    sha1Hash: string
    createTime: string
    updateTime: string
  }

  interface Tables {
    // BASE type
    users: User

    users_composite: Knex.CompositeTableType<
      // SELECT type
      User,
      // INSERT type
      Pick<User, 'name' | 'hash' | 'salt'> &
        Partial<Pick<User, 'createTime' | 'updateTime'>>,
      // UPDATE type
      Partial<Omit<User, 'id' | 'createTime'>>
    >

    // BASE type
    files: File

    files_composite: Knex.CompositeTableType<
      // SELECT type
      File,
      // INSERT type
      Pick<File, 'originalName' | 'sha1Hash' | 'userId'> &
        Partial<Pick<File, 'createTime' | 'updateTime' | 'sizeInBytes'>>,
      // UPDATE type
      Partial<Omit<File, 'id' | 'createTime'>>
    >
  }
}
