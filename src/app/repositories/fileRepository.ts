import { getKnex } from '../database'

export interface File {
  id: string
  userId: string
  originalName: string
  sizeInBytes?: string
  sha1Hash: string
  createTime?: string
  updateTime?: string
}

const getFileForHash = (file: Pick<File, 'sha1Hash'>) =>
  getKnex()('files').where('sha1Hash', file.sha1Hash).first()

const createFiles = async (
  files: Array<
    Pick<File, 'originalName' | 'sha1Hash' | 'userId'> &
      Partial<Pick<File, 'sizeInBytes'>>
  >
) => getKnex().batchInsert('files', files).returning('*')

export { getFileForHash, createFiles }
