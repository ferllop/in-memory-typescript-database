import {SyncDatabase} from './SyncDatabase.js'
import {Entity} from './Entity.js'
import {Database} from './Database.js'
import {Id} from './Id.js'
import { Finder } from './Finder.js'

export class AsyncDatabase implements Database {

    private syncDatabase = new SyncDatabase()
    private readonly DELAY_IN_MILLISECONDS = 0

    insert(collection: string, entity: Entity) {
        return this.promisify(this.syncDatabase.insert(collection, entity))
    }

    update(collection: string, entity: Entity) {
        return this.promisify(this.syncDatabase.update(collection, entity))
    }

    delete(collection: string, id: Id) {
        return this.promisify(this.syncDatabase.delete(collection, id))
    }

    find(collection: string, finder: Finder) {
        return this.promisify(this.syncDatabase.find(collection, finder))
    }

    findById(collection: string, id: Id) {
        return this.promisify(this.syncDatabase.findById(collection, id))
    }

    private promisify<T>(something: T): Promise<T> {
        return new Promise(resolve => {
            setTimeout(() => resolve(something), this.DELAY_IN_MILLISECONDS)
        })
    }

    getCollection(collection: string) {
        return this.syncDatabase.getCollection(collection)
    }

    getCollections() {
        return this.syncDatabase.getCollections()
    }

    clean() {
        return this.syncDatabase.clean()
    }

}
