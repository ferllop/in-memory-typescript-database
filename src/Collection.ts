import {Identified} from './Identified.js'
import {precondition} from 'preconditions'

export class Table {
    private rows: Map<string, Identified>

    constructor() {
        this.rows = new Map()
    }

    create(dto: Identified): boolean {
        precondition(dto.id)
        const previousSize = this.rows.size
        this.rows.set(dto.id, dto)
        return this.rows.size === previousSize + 1
    }

    read(id: string): Identified | null {
        precondition(Boolean(id))
        const data = this.rows.get(id)
        return data ?? null
    }

    update(dto: Identified): boolean {
        precondition(dto.id)
        if (!this.rows.has(dto.id)) {
            return false
        }
        const preUpdateData = this.read(dto.id)
        this.rows.set(dto.id, {...preUpdateData, ...dto})
        return true
    }

    delete(id: string): boolean {
        return this.rows.delete(id)
    }

    find(finder: (dto: Identified) => boolean): Identified[] {
        let result: Identified[] = []
        this.rows.forEach(row => {
            if (finder(row)) {
                result = result.concat(row)
            }
        })
        return result
    }
}