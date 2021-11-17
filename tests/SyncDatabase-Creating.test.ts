import {SyncDatabase} from '../src/SyncDatabase.js'
import {assert, suite} from './test-config.js'
import {Context} from './SyncDatabase.test.js'
import {Result} from '../src/Result.js'
import {ErrorType} from '../src/ErrorType.js'

const database = suite<Context>('In-memory database when creating')

database.before.each( context => {
    context.database = new SyncDatabase()
})

database('should return NO_ERROR when storing a dto', ({database}) => {
    const dto = { id: 'someId', data: 'someData' }
    const result = database.insert('a-table', dto)
    assert.equal(result.error.code, ErrorType.NO_ERROR)
})

database('should store a dto with an id property', ({database}) => {
    const dto = { id: 'someId', data: 'someData' }
    database.insert('a-table', dto)
    assert.is(database.findById('a-table', dto.id).data, dto)
})

database('should return RESOURCE_ALREADY_EXISTS error when duplicating an entity', ({database}) => {
    const dto = { id: 'someId', data: 'someData' }
    database.insert('a-table', dto)
    const result = database.insert('a-table', dto)
    assert.equal(result, Result.withErrorType(ErrorType.RESOURCE_ALREADY_EXISTS))
})

database('should not modify the stored entity when duplicating the storage', ({database}) => {
    const table = 'aTable'
    const dto = { id: 'theId', data: 'firstData' }
    database.insert(table, dto)
    database.insert(table, { ...dto, data: 'modified' })
    assert.equal(database.findById(table, dto.id).data, dto)
})

database.run()
