import {Database} from './Database'
import {Id} from './models/Id'
import {Entity} from './models/Entity.js'
import {Finder} from './models/Finder'
import {Collection, NullCollection} from './models/Collection.js'
import {Result} from './models/Result.js'
import {DatabaseError} from '../error/DatabaseError.js'
import {CollectionDoesNotExistsError} from '../error/CollectionDoesNotExistsError'

export class SyncDatabase implements Database {

    private collections = new Map<string, Collection>()

    insert(collection: string, entity: Entity) {
        if (!this.hasCollection(collection)) {
            this.collections.set(collection, new Collection())
        }

        try {
            this.getCollection(collection).create(entity)
        } catch (error) {
            if (error instanceof DatabaseError) {
                return Result.withError(error)
            }
            throw error
        }

        return Result.ok(null)
    }

    update(collection: string, entity: Entity) {
        if (!this.hasCollection(collection)) {
            return Result.withError(new CollectionDoesNotExistsError(collection))
        }

        try {
            this.getCollection(collection).update(entity)
        } catch (error) {
            if (error instanceof DatabaseError) {
                return Result.withError(error)
            }
            throw error
        }

        return Result.ok(null)
    }

    delete(collection: string, id: Id) {
        if (!this.hasCollection(collection)) {
            return Result.withError(new CollectionDoesNotExistsError(collection))
        }

        try {
            this.getCollection(collection).delete(id)
        } catch (error) {
            if (error instanceof DatabaseError) {
                return Result.withError(error)
            }
            throw error
        }

        return Result.ok(null)
    }

    find(collection: string, finder: Finder) {
        if (!this.hasCollection(collection)) {
            return Result.withError(new CollectionDoesNotExistsError(collection))
        }
        return Result.ok(this.getCollection(collection)?.find(finder) ?? [])
    }

    findById(collection: string, id: Id) {
        if (this.getCollection(collection).isNull()) {
            return Result.withError(new CollectionDoesNotExistsError(collection))
        }

        return Result.ok(this.getCollection(collection).read(id) ?? null)
    }

    private hasId(collection: string, id: Id): boolean {
        return this.getCollection(collection).hasId(id)
    }

    hasCollection(collection: string) {
        return this.collections.has(collection)
    }

    getCollection(collection: string) {
        return this.collections.get(collection) ?? new NullCollection()
    }

    getCollections() {
        return this.collections
    }

    clean() {
        this.collections = new Map()
    }
}
