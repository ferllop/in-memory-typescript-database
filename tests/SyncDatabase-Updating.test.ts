import {assert, suite} from './test-config.js'
import {Context} from './SyncDatabase.test.js'
import {SyncDatabase} from '../src/SyncDatabase.js'
import {CollectionDoesNotExistsError, NoError, ResourceDoesNotExistsError} from '../src/DatabaseError'

const database = suite<Context>('In-memory database when updating')

database.before.each(context => {
    context.database = new SyncDatabase()
})

database('should return NO_ERROR when updating a dto with an id property', ({database}) => {
    const dto = {id: 'anID', data: 'someData'}
    database.insert('aTable', dto)
    const result = database.update('aTable', dto)
    assert.equal(result.error, new NoError())
})

database('should return RESOURCE_DOES_NOT_EXISTS when updating a non-existing dto', ({database}) => {
    const dto = {id: 'anID', data: 'someData'}
    database.insert('aTable', dto)
    const otherDto = {...dto, id: 'otherId'}
    const result = database.update('aTable', otherDto)
    assert.equal(result.error, new ResourceDoesNotExistsError())
})

database('should return COLLECTION_DOES_NOT_EXISTS when updating a non-existing collection', ({database}) => {
    const nonExistingCollection = 'aCollection'
    const dto = {id: 'anID', data: 'someData'}
    const result = database.update(nonExistingCollection, dto)
    assert.equal(result.error, new CollectionDoesNotExistsError(nonExistingCollection))
})

database('should update a dto with an id property', ({database}) => {
    const dto = {id: 'anId', data: 'someData'}
    database.insert('aTable', dto)
    const updatedDto = {...dto, data: 'otherData'}
    database.update('aTable', updatedDto)
    const storedDto = database.findById('aTable', dto.id)?.data as typeof dto
    assert.is(storedDto.data, updatedDto.data)
})

database('should maintain data of a created a dto that is not present in the update dto data', ({database}) => {
    const dto = {id: 'anId', data: 'someData'}
    database.insert('aTable', dto)
    const updatedDto = {id: dto.id, extraData: 'otherData'}
    database.update('aTable', updatedDto)
    const storedDto = database.findById('aTable', dto.id)?.data as typeof dto & typeof updatedDto
    assert.is(storedDto.data, dto.data)
    assert.is(storedDto.extraData, updatedDto.extraData)
})

database.run()
