import {assert, suite} from './test-config.js'
import {TaskedDatabase} from '../src/TaskedDatabase'
import {none, some} from 'fp-ts/Option'
import {right} from 'fp-ts/Either'
import {ResourceAlreadyExistsError} from '../src/DatabaseError'

type Context = {
    database: TaskedDatabase
}

const database = suite<Context>('Tasked in-memory database when creating')

database.before.each( context => {
    context.database = new TaskedDatabase()
})

database('should return None when storing a dto', async ({database}) => {
    const dto = { id: 'someId', data: 'someData' }
    const result = await (database.insert('a-table', dto)())
    assert.equal(result, none)
})

database('should store a dto with an id property', async ({database}) => {
    const dto = { id: 'someId', data: 'someData' }
    await (database.insert('a-table', dto)())
    const actual = await (database.findById('a-table', dto.id)())
    assert.equal(actual, right(dto))
})

database('should return Some of RESOURCE_ALREADY_EXISTS error when duplicating an entity', async ({database}) => {
    const dto = { id: 'someId', data: 'someData' }
    await (database.insert('a-table', dto)())
    const result = await (database.insert('a-table', dto)())
    assert.equal(result, some(new ResourceAlreadyExistsError()))
})

database('should not modify the stored entity when duplicating the storage', async ({database}) => {
    const table = 'aTable'
    const dto = { id: 'theId', data: 'firstData' }
    await (database.insert(table, dto)())
    await (database.insert(table, { ...dto, data: 'modified' })())
    const actual = await (database.findById(table, dto.id)())
    assert.equal(actual, right(dto))
})

database.run()
