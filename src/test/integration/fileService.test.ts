import * as testing from '../testing'
import * as openapi from '../../openapi-gen'
import * as fileRepository from '../../app/repositories/fileRepository'
import { createReadStream } from 'fs'
import { join } from 'path'

describe('Upload file', () => {
  test('Upload file and save the file context', async () => {
    const TEST_FILE_SIZE = '4009'
    const FILE_NAME = 'testFile.txt'

    const { id, name } = await testing.createUser()

    const response = await testing
      .request()
      .post('/api/v1/uploads')
      .set(testing.setBearer({ user: { id: id!, name: name! } }))
      .attach('file', createReadStream(join(__dirname, 'testFile.txt')))
      .field('files', FILE_NAME)
    const [dataFromResponse]: openapi.OpenAPIRouteResponseBody<
      openapi.paths['/api/v1/uploads']
    > = response.body

    const file = await fileRepository.getFileForHash({
      sha1Hash: dataFromResponse?.file?.sha1Hash ?? '',
    })
    expect(file).toBeDefined()

    expect(dataFromResponse.file?.name).toEqual(file?.originalName)
    expect(dataFromResponse.file?.sha1Hash).toEqual(file?.sha1Hash)

    expect(dataFromResponse.file?.sizeInBytes).toEqual(TEST_FILE_SIZE)
    expect(file?.sizeInBytes).toEqual(TEST_FILE_SIZE)
  })

  test('Upload file fails with wrong multipart/form field name', async () => {
    const FILE_NAME = 'testFile.txt'

    const { id, name } = await testing.createUser()

    const response = await testing
      .request()
      .post('/api/v1/uploads')
      .set(testing.setBearer({ user: { id: id!, name: name! } }))
      .attach('file', createReadStream(join(__dirname, 'testFile.txt')))
      .field('bs', FILE_NAME)

    expect(response.statusCode).toEqual(400)
  })

  test('Upload file fails for not authenticated user', async () => {
    const FILE_NAME = 'testFile.txt'

    const response = await testing
      .request()
      .post('/api/v1/uploads')
      .attach('file', createReadStream(join(__dirname, 'testFile.txt')))
      .field('files', FILE_NAME)

    expect(response.statusCode).toEqual(401)
  })
})
