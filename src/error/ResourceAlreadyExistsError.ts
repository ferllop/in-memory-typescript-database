import {DatabaseError} from './DatabaseError'

export class ResourceAlreadyExistsError extends DatabaseError {
    constructor() {
        super('RESOURCE_ALREADY_EXISTS', 'Resource already exists')
    }
}