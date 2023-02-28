import {Entity} from './models/Entity.js'
import {Id} from './models/Id.js'
import {Finder} from './models/Finder.js'
import {Collection} from './models/Collection.js'
import {DatabaseError} from '../error/DatabaseError.js'
import {Result} from './models/Result.js'
import {TaskEither} from 'fp-ts/TaskEither'
import {Task} from 'fp-ts/Task'
import {Option} from 'fp-ts/Option'

type DataOrNull<T> = Result<T | null>

type ResultWrapper<T> =
    DataOrNull<T> |
    Promise<DataOrNull<T>> |
    TaskEither<DatabaseError, NonNullable<T>> | Task<Option<DatabaseError>>

export interface Database {
    insert(collection: string, entity: Entity): ResultWrapper<null>

    update(collection: string, entity: Entity): ResultWrapper<null>

    delete(collection: string, id: Id): ResultWrapper<null>

    find(collection: string, finder: Finder): ResultWrapper<Entity[]>

    findById(collection: string, id: Id): ResultWrapper<Entity | null>

    hasCollection(collection: string): boolean

    getCollection(collection: string): Collection

    getCollections(): Map<string, Collection>

    clean(): void
}
