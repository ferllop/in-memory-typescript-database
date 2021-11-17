import {ErrorType} from './ErrorType.js'

export class DatabaseError extends Error {

    private readonly _code: number

    constructor(errorType: ErrorType) {
        super("ErrorCode: " + errorType.valueOf().toString())
        this._code = errorType
    }

    get code() {
        return this._code
    }
}
