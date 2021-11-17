import {Entity} from './Entity.js'
import {Id} from './Id.js'
import {Finder} from './Finder.js'
import {Collection} from './Collection.js'
import {DatabaseError} from './DatabaseError.js'
import {Result} from './Result.js'

type DataOrNull<T> = Result<T | null>

type SyncOrAsync<T> = DataOrNull<T> | Promise<DataOrNull<T>>

export interface Database {
    insert(table: string, entity: Entity): SyncOrAsync<null>

    update(table: string, entity: Entity): SyncOrAsync<null>

    delete(table: string, id: Id): SyncOrAsync<null>

    find(table: string, finder: Finder): SyncOrAsync<Entity[]>

    findById(table: string, id: Id): SyncOrAsync<Entity | null>

    getCollection(table: string): Collection

    getCollections(): Map<string, Collection>

    clean(): void
}
