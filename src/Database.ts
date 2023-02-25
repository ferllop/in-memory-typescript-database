import {Entity} from './Entity.js'
import {Id} from './Id.js'
import {Finder} from './Finder.js'
import {Collection} from './Collection.js'
import {DatabaseError} from './DatabaseError.js'
import {Result} from './Result.js'
import * as TE from 'fp-ts/TaskEither'
import * as O from 'fp-ts/Option'

type DataOrNull<T> = Result<T | null>

type SyncOrAsync<T> =
    DataOrNull<T> |
    Promise<DataOrNull<T>> |
    TE.TaskEither<DatabaseError, O.Option<T>> | T.Task<O.Option<DatabaseError>>

export interface Database {
    insert(collection: string, entity: Entity): SyncOrAsync<null>

    update(collection: string, entity: Entity): SyncOrAsync<null>

    delete(collection: string, id: Id): SyncOrAsync<null>

    find(collection: string, finder: Finder): SyncOrAsync<Entity[]>

    findById(collection: string, id: Id): SyncOrAsync<Entity | null>

    hasCollection(collection: string): boolean

    getCollection(collection: string): Collection

    getCollections(): Map<string, Collection>

    clean(): void
}
