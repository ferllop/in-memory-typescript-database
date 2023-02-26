import {assert, suite} from './test-config.js'
import {ErrorType} from '../src/ErrorType.js'
import {getError, TaskedDatabase} from '../src/TaskedDatabase'
import {none, some} from 'fp-ts/Option'
import {Either, map, right} from 'fp-ts/Either'

type Context = {
    database: TaskedDatabase
}

const database = suite<Context>('Tasked in-memory database when updating')

database.before.each(context => {
    context.database = new TaskedDatabase()
})

database('should return None when updating a dto with an id property', async ({database}) => {
    const dto = {id: 'anID', data: 'someData'}
    await (database.insert('aTable', dto)())
    const result = await (database.update('aTable', dto)())
    assert.equal(result, none)
})

database('should return Some of RESOURCE_DOES_NOT_EXISTS error when updating a non-existing dto', async ({database}) => {
    const dto = {id: 'anID', data: 'someData'}
    database.insert('aTable', dto)
    const otherDto = {...dto, id: 'otherId'}
    const result = await (database.update('aTable', otherDto)())
    assert.equal(result, some(getError(ErrorType.RESOURCE_DOES_NOT_EXISTS)))
})

database('should return Some of COLLECTION_DOES_NOT_EXISTS when updating a non-existing collection', async ({database}) => {
    const dto = {id: 'anID', data: 'someData'}
    const result = await (database.update('aTable', dto)())
    assert.equal(result, some(getError(ErrorType.COLLECTION_DOES_NOT_EXISTS)))
})

database('should update a dto with an id property', async ({database}) => {
    const dto = {id: 'anId', data: 'someData'}
    await (database.insert('aTable', dto)())
    const updatedDto = {...dto, data: 'otherData'}
    await (database.update('aTable', updatedDto)())
    const storedDto = await (database.findById('aTable', dto.id)())
    assert.equal(storedDto, right(updatedDto))
})

database('should maintain data of a created a dto that is not present in the update dto data', async ({database}) => {
    const dto = {id: 'anId', data: 'someData'}
    await (database.insert('aTable', dto)())
    const updatedDto = {id: dto.id, extraData: 'otherData'}
    await (database.update('aTable', updatedDto)())
    const storedDto = await (database.findById('aTable', dto.id)()) as Either<never, typeof dto & typeof updatedDto>
    assert.equal(map((x: typeof dto) => x.data)(storedDto), right(dto.data), "first")
    assert.equal(map((x: typeof updatedDto) => x.extraData)(storedDto), right(updatedDto.extraData), "second")
})

database.run()
