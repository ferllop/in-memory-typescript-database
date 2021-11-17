import {assert, suite} from './test-config.js'
import {Database} from '../src/Database.js'
import {SyncDatabase} from '../src/SyncDatabase.js'
import {ErrorType} from '../src/ErrorType.js'
import {Result} from '../src/Result.js'

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
        Result.withErrorType(ErrorType.COLLECTION_DOES_NOT_EXISTS) )
})

database.run()

