import {SyncDatabase} from '../src/database/SyncDatabase.js'
import {assert, suite} from './test-config.js'
import {Context} from './SyncDatabase.test.js'
import {Result} from '../src/database/models/Result.js'
import {NoError} from '../src/error/NoError'
import {ResourceAlreadyExistsError} from '../src/error/ResourceAlreadyExistsError'

const database = suite<Context>('In-memory database when creating')

database.before.each( context => {
    context.database = new SyncDatabase()
})

database('should return NO_ERROR when storing a dto', ({database}) => {
    const dto = { id: 'someId', data: 'someData' }
    const result = database.insert('a-table', dto)
    assert.equal(result.error, new NoError())
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
    assert.equal(result, Result.withError(new ResourceAlreadyExistsError()))
})

database('should not modify the stored entity when duplicating the storage', ({database}) => {
    const table = 'aTable'
    const dto = { id: 'theId', data: 'firstData' }
    database.insert(table, dto)
    database.insert(table, { ...dto, data: 'modified' })
    assert.equal(database.findById(table, dto.id).data, dto)
})

database.run()
