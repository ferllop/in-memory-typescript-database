import {Database} from './Database'
import {SyncDatabase} from './SyncDatabase'
import {Result} from './models/Result'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import {Entity} from './models/Entity'
import * as O from 'fp-ts/Option'
import {Id} from './models/Id'
import {Finder} from './models/Finder'
import {DatabaseError} from '../error/DatabaseError'
import {NoError} from '../error/NoError'
import {ResourceDoesNotExistsError} from '../error/ResourceDoesNotExistsError'

export class TaskedDatabase implements Database {
    private readonly _syncDb = new SyncDatabase()

    constructor(private readonly _delayInMilliseconds: number = 0) {
    }

    private makeTaskEither<T>(result: Result<T>): TE.TaskEither<DatabaseError, NonNullable<T>> {
        const task = result.data !== null ?
            E.right(result.data as NonNullable<T>) : E.left(result.error)
        return () => new Promise(resolve => {
            setTimeout(() => resolve(task), this._delayInMilliseconds)
        })
    }

    private makeTask<T>(result: Result<T>): T.Task<O.Option<DatabaseError>> {
        const task = result.error instanceof NoError ?
            O.none : O.some(result.error)
        return () => new Promise(resolve => {
            setTimeout(() => resolve(task), this._delayInMilliseconds)
        })
    }

    insert(collection: string, entity: Entity): T.Task<O.Option<DatabaseError>> {
        return this.makeTask(this._syncDb.insert(collection, entity))
    }

    update(collection: string, entity: Entity) {
        return this.makeTask(this._syncDb.update(collection, entity))
    }

    delete(collection: string, id: Id) {
        return this.makeTask(this._syncDb.delete(collection, id))
    }

    find(collection: string, finder: Finder): TE.TaskEither<DatabaseError, Entity[]> {
        return this.makeTaskEither(this._syncDb.find(collection, finder))
    }

    findById(collection: string, id: Id): TE.TaskEither<DatabaseError, Entity> {
        const x = this._syncDb.findById(collection, id)
        const nonNullResult =
            x.data === null && x.error instanceof NoError
            ? Result.withError(new ResourceDoesNotExistsError())
            : x
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