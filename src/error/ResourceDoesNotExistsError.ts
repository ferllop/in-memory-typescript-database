import {DatabaseError} from './DatabaseError'

export class ResourceDoesNotExistsError extends DatabaseError {
    constructor() {
        super('RESOURCE_DOES_NOT_EXISTS', 'Resource does not exists')
    }
}