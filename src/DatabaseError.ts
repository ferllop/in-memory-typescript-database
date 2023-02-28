type ErrorType = 'NO_ERROR'
    | 'COLLECTION_DOES_NOT_EXISTS'
    | 'RESOURCE_ALREADY_EXISTS'
    | 'RESOURCE_DOES_NOT_EXISTS'

function getErrorCode(errorType: ErrorType): number {
    const map: Record<ErrorType, number> = {
        NO_ERROR: 0,
        COLLECTION_DOES_NOT_EXISTS: 1,
        RESOURCE_ALREADY_EXISTS: 2,
        RESOURCE_DOES_NOT_EXISTS: 3,
    }
    return map[errorType]
}

export abstract class DatabaseError extends Error {
    private readonly code: number

    protected constructor(errorType: ErrorType, message: string) {
        super(message)
        this.code = getErrorCode(errorType)
    }

    toDto() {
        return {
            code: this.code,
            message: this.message,
        }
    }
}

export class NoError extends DatabaseError {
    constructor() {
        super('NO_ERROR', "No error")
    }
}

export class ResourceDoesNotExistsError extends DatabaseError {
    constructor() {
        super('RESOURCE_DOES_NOT_EXISTS', "Resource does not exists")
    }
}

export class CollectionDoesNotExistsError extends DatabaseError {
    constructor(collectionName: string) {
        super('COLLECTION_DOES_NOT_EXISTS', `Collection '${collectionName}' does not exists`)
    }
}

export class ResourceAlreadyExistsError extends DatabaseError {
    constructor() {
        super('RESOURCE_ALREADY_EXISTS', 'Resource already exists')
    }
}
