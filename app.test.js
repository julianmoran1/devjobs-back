import { test, describe, before, after } from 'node:test'
import assert from 'node:assert'
import app from './app.js'
import { error } from 'node:console'
let server
const PORT = 3456
const BASE_URL = `http://localhost:${PORT}`

before(async () => {
  return new Promise((resolve, reject) => {
    server = app.listen(PORT, () => resolve())
    server.on('error', (error) => reject(error))
  })
})


after(async () => {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) return reject(error)
      resolve()
    })
  })
})

describe('GET /jobs', () => {
  test('respond with status code 200 and a jobs array', async () => {
    const response = await fetch(`${BASE_URL}/jobs`)
    assert.strictEqual(response.status, 200)

    const json = await response.json()
    assert.ok(Array.isArray(json.data), 'response must be an array')
  })

    test('respond with status code 200 and a job object', async () => {
    const validJobId = '7a4d1d8b-1e45-4d8c-9f1a-8c2f9a9121a4'
    const response = await fetch(`${BASE_URL}/jobs/${validJobId}`)
    assert.strictEqual(response.status, 200)

    const json = await response.json()
    assert.ok(json.id, validJobId)
  })
})
