import {DatabaseError} from './DatabaseError'

export class NoError extends DatabaseError {
    constructor() {
        super('NO_ERROR', 'No error')
    }
}