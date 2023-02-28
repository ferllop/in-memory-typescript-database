import {Id} from './Id.js'

export type Entity = Record<any, any> & { id: Id }