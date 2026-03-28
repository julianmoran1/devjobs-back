import express from 'express'
import { writeFileSync } from 'node:fs'
import jobs from './jobs.json' with { type: 'json' }
import cors from 'cors'

  let filteredJobs = jobs

const PORT = process.env.PORT ?? 1234
const app = express()
app.use(express.json())

// Para permitir acceso desde cualquier origen
// app.use(cors())

const ACCEPTED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:1234',
]

app.use(cors({
  origin: (origin, callback) => {
    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('Origen no permitido'))
  }
}))

// const jobs = JSON.parse(readFileSync('./jobs.json', 'utf-8'))


app.use((request, response, next) => {
  const timeString = new Date().toLocaleTimeString()
  console.log(`${timeString} - ${request.method} - ${request.url}`)
  next()
})

const healthMiddleware = (request, response, next) => {
  console.log('middleware para health')
  next()
}

app.get('/', (request, response) => {
  return response.send('Punto de entrada')
})



app.get('/health', healthMiddleware, (request, response) => {
  return response.json({
    status: 'ok',
    uptime: process.uptime()
  })
})

app.listen(PORT, () => {
  console.log(`servidor levantado en http://localhost:${PORT}`)
})