import {assert, suite} from './test-config.js'
import {Context} from './SyncDatabase.test.js'
import {SyncDatabase} from '../src/SyncDatabase.js'

const database = suite<Context>('In-memory database when searching')

database.before.each(context => {
    context.database = new SyncDatabase()
})

database('should return an empty array where there are no coincidences', ({database}) => {
    const table = 'aTable'
    database.insert(table, {id: 'a'})
    const result = database.find('aTable', () => false)
    assert.is(result.data?.length, 0)
})

database('should return an array with one coincidence', ({database}) => {
    const table = 'aTable'
    database.insert(table, {id: 'a', data: 'thing'})
    const result = database.find('aTable', (row: any) => row.data === 'thing')
    assert.is(result.data?.length, 1)
})

database('should return an array with all the coincidences', ({database}) => {
    const table = 'aTable'
    const dtoA = {id: 'a', label: 'labelA'}
    const dtoB = {id: 'b', label: 'labelA'}
    const dtoC = {id: 'c', label: 'labelB'}
    database.insert(table, dtoA)
    database.insert(table, dtoB)
    database.insert(table, dtoC)
    const result = database.find('aTable', (row: any) => row.label === 'labelA')
    assert.is(result.data?.length, 2)
    assert.ok(
        result.data?.some(dto => dto.id === 'a') &&
        result.data?.some(dto => dto.id === 'b') &&
        !result.data?.some(dto => dto.id === 'c'))
})

database.run()
