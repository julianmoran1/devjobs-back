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
  return response.send('Hola hola')
})

app.get('/jobs', async (request, response) => {
  console.log(request.query)
  const { text, location, level, limit = 10, technology, offset = 0 } = request.query

  // la importación de los empleos se hace aquí para evitar hacer la importacion al ejecutar el archivo
  // const { default: jobs }  = await import('./jobs.json', { with: { type: 'json' } })
  let filteredJobs = jobs


  if (text) {
    const searchTerm = text.toLowerCase()
    filteredJobs = filteredJobs.filter(
      job => job.titulo.toLowerCase().includes(searchTerm) || job.descripcion?.toLowerCase().includes(searchTerm)
    )
  }

    if (technology) {
    filteredJobs = filteredJobs.filter(
      job => job.data?.technology?.some(tech => tech.toLowerCase().includes(technology.toLowerCase()))
    )
  }

    if (level) {
    filteredJobs = filteredJobs.filter(
      job => job.data?.nivel?.toLowerCase().includes(level.toLowerCase())
    )
  }

    if (location) {
    filteredJobs = filteredJobs.filter(
      job => job.data?.modalidad?.toLowerCase().includes(location.toLowerCase())
    )
  }

  // Paginacion
  const limitNumber = Number(limit)
  const offsetNumber = Number(offset)
  const paginatedJobs = filteredJobs.slice(offsetNumber, offsetNumber + limitNumber)

  return response.json(
    { data: paginatedJobs,
      total: filteredJobs.length,
      limit: limitNumber,
      offset: offsetNumber })
})

app.get('/jobs/:id', async (request, response) => {
  const {id} = request.params
  const specificJob = jobs.find( job => job.id === id )

  if(!specificJob) {
    return response.status(404).json({message: "job not found"})
  }

  return response.json(specificJob)
})

app.post('/jobs', async (request, response) => {
  const { titulo, empresa, ubicacion, data }  = request.body
  const newJob = {
    id: crypto.randomUUID(),
    titulo,
    empresa,
    ubicacion,
    data
  }

  jobs.push(newJob)
  // writeFileSync('./jobs.json', JSON.stringify(jobs, null, 2))
  return response.status(201).json(newJob)
})

app.put('/jobs/:id', async (request, response) => {
// Reemplazar un empleo completo
})

app.patch('/jobs/:id', async (request, response) => {
// Actualizar parcialmente un empleo
})

app.delete('/jobs/:id', async (request, response) => {
// borrar un empleo
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