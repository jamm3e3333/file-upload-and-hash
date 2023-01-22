import * as openapi from '../../openapi-gen'
import * as ctrl from '../controllers'
import * as utils from '../utils'
import * as fileRepository from '../repositories/fileRepository'

const getFilesArrayForFiles = (
  files: ctrl.FilesForServiceHandler
): ctrl.FileFromContext[] | [] => {
  if (!files) {
    return []
  }
  if (Array.isArray(files)) {
    return files
  }
  return []
}

export const handleFileUpload: ctrl.FileUploadServiceHandler = (
  context,
  files
): Promise<
  openapi.OpenAPIRouteResponseBody<openapi.paths['/api/v1/uploads']>
> =>
  utils.pipe(
    () => ctrl.getContextTyped<openapi.paths['/api/v1/uploads']>(context),
    async context => {
      const filesContext = getFilesArrayForFiles(files)?.map(x => ({
        originalName: x.originalname,
        sha1Hash: x.sha1Hash,
        userId: context.user?.id ?? '-1',
        sizeInBytes: String(x.size ?? ''),
      }))

      await fileRepository.createFiles(filesContext)

      return filesContext.map(x => {
        return {
          file: {
            sha1Hash: x.sha1Hash,
            ...(x.sizeInBytes && { sizeInBytes: x.sizeInBytes }),
            name: x.originalName,
          },
        }
      })
    }
  )(context)
