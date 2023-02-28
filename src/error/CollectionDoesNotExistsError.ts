import {DatabaseError} from './DatabaseError'

export class CollectionDoesNotExistsError extends DatabaseError {
    constructor(collectionName: string) {
        super('COLLECTION_DOES_NOT_EXISTS', `Collection '${collectionName}' does not exists`)
    }
}