import {assert, suite} from './test-config.js'
import {ErrorType} from '../src/ErrorType.js'
import {Result} from '../src/Result.js'
import {TaskedDatabase} from '../src/TaskedDatabase'
import {none, some} from 'fp-ts/Option'
import {left} from 'fp-ts/Either'

type Context = {
    database: TaskedDatabase
}

const database = suite<Context>('Tasked in-memory database when deleting')

database.before.each(context => {
    context.database = new TaskedDatabase()
})

database('should return None when deleting from an id', async ({database}) => {
    const id = 'anID'
    const dto = {id, data: 'someData'}
    await (database.insert('aTable', dto)())
    const result = await (database.delete('aTable', id)())
    assert.equal(result, none)
})

database('should return Some of RESOURCE_DOES_NOT_EXISTS error when deleting a non existing id', async ({database}) => {
    const dto = {id: 'someId', data: 'someData'}
    await (database.insert('aTable', dto)())
    const id = 'anID'
    const actual = await (database.delete('aTable', id)())
    assert.equal(actual, some(Result.withErrorType(ErrorType.RESOURCE_DOES_NOT_EXISTS).error))
})

database('should return Some of COLLECTION_DOES_NOT_EXISTS error when deleting from a non existing collection', async ({database}) => {
    const id = 'anID'
    const actual = await (database.delete('aTable', id)())
    assert.equal(actual, some(Result.withErrorType(ErrorType.COLLECTION_DOES_NOT_EXISTS).error))
})

database('should delete a dto with an id', async ({database}) => {
    const id = 'anID'
    const dto = {id, data: 'someData'}
    await (database.insert('aTable', dto)())
    await (database.delete('aTable', id)())
    const actual = await (database.findById('aTable', id)())
    assert.equal(actual, left(Result.withErrorType(ErrorType.RESOURCE_DOES_NOT_EXISTS).error))
})

database.run()
