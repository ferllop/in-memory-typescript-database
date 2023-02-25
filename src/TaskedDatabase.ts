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
import {AsyncDatabase} from './AsyncDatabase'
import {ErrorType} from './ErrorType'

class TaskedDatabase implements Database {
    private readonly _syncDb = new SyncDatabase()
    private readonly _asyncDb = new AsyncDatabase()

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
        const task = result.error.code === ErrorType.NO_ERROR ?
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
        return this.makeTaskEither(this._syncDb.findById(collection, id))
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