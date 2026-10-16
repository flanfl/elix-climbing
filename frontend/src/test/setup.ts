import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Testing Library only unmounts rendered components between tests by itself when the test
// runner exposes global hooks. We keep Vitest's globals off (explicit imports everywhere),
// so we do it ourselves; otherwise one test's DOM leaks into the next.
afterEach(() => {
  cleanup()
})
