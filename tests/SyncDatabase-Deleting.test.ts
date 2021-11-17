import {assert, suite} from './test-config.js'
import {Context} from './SyncDatabase.test.js'
import {SyncDatabase} from '../src/SyncDatabase.js'
import {ErrorType} from '../src/ErrorType.js'
import {Result} from '../src/Result.js'

const database = suite<Context>('In-memory database when deleting')

database.before.each(context => {
    context.database = new SyncDatabase()
})

database('should return NO_ERROR when deleting from an id', ({database}) => {
    const id = 'anID'
    const dto = {id, data: 'someData'}
    database.insert('aTable', dto)
    const result = database.delete('aTable', id)
    assert.equal(result.error.code, ErrorType.NO_ERROR)
})

database('should return RESOURCE_DOES_NOT_EXISTS error when deleting a non existing id', ({database}) => {
    const dto = {id: 'someId', data: 'someData'}
    database.insert('aTable', dto)
    const id = 'anID'
    assert.equal(database.delete('aTable', id), Result.withErrorType(ErrorType.RESOURCE_DOES_NOT_EXISTS))
})

database('should return COLLECTION_DOES_NOT_EXISTS error when deleting from a non existing collection', ({database}) => {
    const id = 'anID'
    assert.equal(database.delete('aTable', id), Result.withErrorType(ErrorType.COLLECTION_DOES_NOT_EXISTS))
})

database('should delete a dto with given an id', ({database}) => {
    const id = 'anID'
    const dto = {id, data: 'someData'}
    database.insert('aTable', dto)
    database.delete('aTable', id)
    assert.is(database.findById('aTable', id).data, null)
})

database.run()
