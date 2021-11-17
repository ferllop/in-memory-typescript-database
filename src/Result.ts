import {ErrorType} from './ErrorType.js'
import {DatabaseError} from './DatabaseError.js'

export class Result<T> {
    private constructor(
        private _error: DatabaseError,
        private _data: T
    ) {}

    get data() {
        return this._data
    }

    get error() {
        return this._error
    }

    static ok<T>(data: T) {
        return new Result(new DatabaseError(ErrorType.NO_ERROR), data)
    }

    static withErrorType(errorType: ErrorType) {
        return new Result(new DatabaseError(errorType), null)
    }

    static withError(error: DatabaseError) {
        return new Result(error, null)
    }
}