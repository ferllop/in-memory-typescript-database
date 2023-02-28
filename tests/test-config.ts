import {suite, test} from 'uvu'
import * as assert from 'uvu/assert'
import { precondition } from '../src/lib/preconditions'

process.env.ENABLE_PRECONDITIONS = 'false'

const tests = suite('Tests')

tests('should have preconditions disabled', () => {
    try {
      precondition(false)
    } catch(error) {
      assert.unreachable()
    }
})

tests.run()

export { suite, test, assert }
