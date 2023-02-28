import { assert, suite } from './test-config.js'
import { AsyncDatabase } from '../src/database/AsyncDatabase.js'

type Context = {
  database: AsyncDatabase
}

const asyncDatabase = suite<Context>('Async in memory database')

asyncDatabase.before.each( context => {
  context.database = new AsyncDatabase()
})

asyncDatabase('should have asynchronous crud methods', ({database}) => {
  assert.instance(database.insert('atable', {id: 'anId'}), Promise, 'Create method')
  assert.instance(database.update('atable', {id: 'anId'}), Promise, 'Update method')
  assert.instance(database.delete('atable', 'anId'), Promise, 'Delete method')
  assert.instance(database.find('atable', () => true), Promise, 'Find method')
})

asyncDatabase.run()
