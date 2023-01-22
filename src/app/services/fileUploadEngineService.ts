import * as Exress from 'express'
import * as Multer from 'multer'
import { getFileContextForReadable } from '../utils'
import logger from '../logger'

export class FileUploadEngine implements Multer.StorageEngine {
  async _handleFile(
    _req: Exress.Request,
    file: Express.Multer.File,
    callback: (
      error?: any,
      info?: Partial<Express.Multer.File & { sha1Hash: string }>
    ) => void
  ): Promise<void> {
    getFileContextForReadable(file.stream)
      .then(data => {
        callback(null, {
          ...file,
          sha1Hash: data.fileHash ?? '',
          size: data.fileSize,
        })
      })
      .catch(error => {
        logger.error({ error }, 'File cannot be processed')
      })
  }

  /* eslint-disable @typescript-eslint/no-empty-function */
  _removeFile(
    _req: Exress.Request,
    _file: Express.Multer.File,
    _callback: (error: Error) => void
  ): Promise<void> | void {}
}
