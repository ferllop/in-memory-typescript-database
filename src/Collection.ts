import {Entity} from './Entity.js'
import {precondition} from 'preconditions'
import {Id} from './Id.js'
import {ErrorType} from './ErrorType.js'
import {DatabaseError} from './DatabaseError.js'

export class Collection {

    private rows: Map<string, Entity>

    constructor() {
        this.rows = new Map()
        this.create
       }

    create(entity: Entity) {
        precondition(entity.id)
        if (this.hasId(entity.id)) {
            throw new DatabaseError(ErrorType.RESOURCE_ALREADY_EXISTS)
        }
        this.rows.set(entity.id, entity)
    }

    read(id: Id): Entity | null {
        precondition(Boolean(id))
        const data = this.rows.get(id)
        return data ?? null
    }

    update(entity: Entity) {
        precondition(entity.id)
        if (!this.hasId(entity.id)) {
            throw new DatabaseError(ErrorType.RESOURCE_DOES_NOT_EXISTS)
        }
        const preUpdateData = this.read(entity.id)
        this.rows.set(entity.id, {...preUpdateData, ...entity})
    }

    delete(id: Id) {
        const exists = this.rows.delete(id)
        if (!exists) {
            throw new DatabaseError(ErrorType.RESOURCE_DOES_NOT_EXISTS)
        }
    }

    find(finder: (entity: Entity) => boolean): Entity[] {
        let result: Entity[] = []
        this.rows.forEach(row => {
            if (finder(row)) {
                result = result.concat(row)
            }
        })
        return result
    }

    hasId(id: Id) {
        return this.rows.has(id)
    }

    isNull() {
        return false
    }
}

export class NullCollection extends Collection {

    create(entity: Entity): boolean {
        return false
    }

    read(id: Id): Entity | null {
        return null
    }

    update(entity: Entity): boolean {
        return false
    }

    delete(id: Id): boolean {
        return false
    }

    find(finder: (entity: Entity) => boolean): Entity[] {
        return []
    }

    isNull() {
        return true
    }
}
