import {Database} from './Database'
import {SyncDatabase} from './SyncDatabase'
import {Result} from './Result'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import {DatabaseError} from './DatabaseError'
import * as E from 'fp-ts/Either'
import {Entity} from './Entity'
import * as O from 'fp-ts/Option'
import {Id} from './Id'
import {Finder} from './Finder'
import {ErrorType} from './ErrorType'

export type TaskedDatabaseError = {
    code : number
    message: string
}

export function getError(type: ErrorType): TaskedDatabaseError {
    const errors = new Map<ErrorType, TaskedDatabaseError>()
        .set(ErrorType.RESOURCE_DOES_NOT_EXISTS,
            {code: ErrorType.RESOURCE_DOES_NOT_EXISTS, message: 'Resource does not exists'})
        .set(ErrorType.RESOURCE_ALREADY_EXISTS,
            {code: ErrorType.RESOURCE_ALREADY_EXISTS, message: 'Resource already exists'})
        .set(ErrorType.COLLECTION_DOES_NOT_EXISTS,
            {code: ErrorType.COLLECTION_DOES_NOT_EXISTS, message: 'Collection does not exists'})

    return errors.get(type) || {code: 0, message : 'Undocumented error'}
}

export class TaskedDatabase implements Database {
    private readonly _syncDb = new SyncDatabase()

    constructor(private readonly _delayInMilliseconds: number = 0) {
    }

    private makeTaskEither<T>(result: Result<T>): TE.TaskEither<TaskedDatabaseError, NonNullable<T>> {
        const task = result.data !== null ?
            E.right(result.data as NonNullable<T>) : E.left(getError(result.error.code))
        return () => new Promise(resolve => {
            setTimeout(() => resolve(task), this._delayInMilliseconds)
        })
    }

    private makeTask<T>(result: Result<T>): T.Task<O.Option<TaskedDatabaseError>> {
        const task = result.error.code === ErrorType.NO_ERROR ?
            O.none : O.some(getError(result.error.code))
        return () => new Promise(resolve => {
            setTimeout(() => resolve(task), this._delayInMilliseconds)
        })
    }

    insert(collection: string, entity: Entity): T.Task<O.Option<TaskedDatabaseError>> {
        return this.makeTask(this._syncDb.insert(collection, entity))
    }

    update(collection: string, entity: Entity) {
        return this.makeTask(this._syncDb.update(collection, entity))
    }

    delete(collection: string, id: Id) {
        return this.makeTask(this._syncDb.delete(collection, id))
    }

    find(collection: string, finder: Finder): TE.TaskEither<TaskedDatabaseError, Entity[]> {
        return this.makeTaskEither(this._syncDb.find(collection, finder))
    }

    findById(collection: string, id: Id): TE.TaskEither<TaskedDatabaseError, Entity> {
        const x = this._syncDb.findById(collection, id)
        const nonNullResult = x.data === null && x.error.code === ErrorType.NO_ERROR ? Result.withErrorType(ErrorType.RESOURCE_DOES_NOT_EXISTS) : x
        return this.makeTaskEither(nonNullResult)
    }

    getCollection(collection: string) {
        return this._syncDb.getCollection(collection)
    }

    getCollections() {
        return this._syncDb.getCollections()
    }

    hasCollection(collection: string): boolean {
        return this._syncDb.hasCollection(collection)
    }

    clean(): void {
        this._syncDb.clean()
    }
}