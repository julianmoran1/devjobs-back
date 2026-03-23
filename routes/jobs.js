import { Router } from "express"
import jobs from '../jobs.json' with { type: 'json' }

export const jobsRouter = Router()

jobsRouter.get('/', async (request, response) => {
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

jobsRouter.get('/:id', async (request, response) => {
  const {id} = request.params
  const specificJob = jobs.find( job => job.id === id )

  if(!specificJob) {
    return response.status(404).json({message: "job not found"})
  }

  return response.json(specificJob)
})

jobsRouter.post('/', async (request, response) => {
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

jobsRouter.put('/:id', async (request, response) => {
// Reemplazar un empleo completo
})

jobsRouter.patch('/:id', async (request, response) => {
// Actualizar parcialmente un empleo
})

jobsRouter.delete('/:id', async (request, response) => {
// borrar un empleo
})