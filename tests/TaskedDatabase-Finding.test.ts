import {assert, suite} from './test-config.js'
import {TaskedDatabase} from '../src/TaskedDatabase'
import {right} from 'fp-ts/Either'

type Context = {
    database: TaskedDatabase
}

const database = suite<Context>('Tasked in-memory database when searching')

database.before.each(context => {
    context.database = new TaskedDatabase()
})

database('should return a Right of empty array when there are no coincidences', async ({database}) => {
    const table = 'aTable'
    await (database.insert(table, {id: 'a'})())
    const result = await (database.find('aTable', () => false)())
    assert.equal(result, right([]))
})

database('should return Right of an array whith one coincidence', async ({database}) => {
    const table = 'aTable'
    const entity = {id: 'a', data: 'thing'}
    await (database.insert(table, entity)())
    const result = await (database.find('aTable', (row: any) => row.data === 'thing')())
    assert.equal(result, right([entity]))
})

database('should return Right of an array with all the coincidences', async ({database}) => {
    const table = 'aTable'
    const dtoA = {id: 'a', label: 'labelA'}
    const dtoB = {id: 'b', label: 'labelA'}
    const dtoC = {id: 'c', label: 'labelC'}
    await (database.insert(table, dtoA)())
    await (database.insert(table, dtoB)())
    await (database.insert(table, dtoC)())
    const result = await (database.find('aTable', (row: any) => row.label === 'labelA')())
    assert.equal(result, right([dtoA, dtoB]))
})

database.run()
