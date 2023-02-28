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
    readonly code: number

    protected constructor(errorType: ErrorType, message: string) {
        super(message)
        this.code = getErrorCode(errorType)
    }
}
