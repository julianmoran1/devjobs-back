import { randomUUID } from 'node:crypto'
import jobs from '../jobs.json' with { type: 'json' }

export class JobModel {
  static async getAll({ text, location, level, limit = 10, technology, offset = 0 }) {
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

    const limitNumber = Number(limit)
    const offsetNumber = Number(offset)
    const paginatedJobs = filteredJobs.slice(offsetNumber, offsetNumber + limitNumber)

    return { data: paginatedJobs, total: filteredJobs.length, limit: limitNumber, offset: offsetNumber }
  }

  static async getById({ id }) {
    const job = jobs.find(job => job.id === id)
    return job
  }

  static async create({ input }) {
    const newJob = {
      id: randomUUID(),
      ...input
    }
    
    jobs.push(newJob)
    return newJob
  }

  static async update({ id, input }) {
    const jobIndex = jobs.findIndex(job => job.id === id)
    if (jobIndex === -1) return null

    jobs[jobIndex] = { ...jobs[jobIndex], ...input }
    return jobs[jobIndex]
  }

  static async delete({ id }) {
    const jobIndex = jobs.findIndex(job => job.id === id)
    if (jobIndex === -1) return null

    const deletedJob = jobs.splice(jobIndex, 1)
    return deletedJob[0]
  }
}