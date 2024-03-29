import {assert, suite} from './test-config.js'
import {SyncDatabase} from '../src/database/SyncDatabase.js'
import {Result} from '../src/database/models/Result.js'
import {CollectionDoesNotExistsError} from '../src'

export type Context = {
    database: SyncDatabase
}

const database = suite<Context>('In-memory database')

database.before.each( context => {
    context.database = new SyncDatabase()
})

database('should be capable of clean itself', ({database}) => {
    const table = 'atable'
    const dto = { id: 'someId', data: 'someData' }
    database.insert(table, dto)
    database.clean()
    assert.equal(
        database.find(table, () => true),
        Result.withError(new CollectionDoesNotExistsError(table)) )
})

database.run()

