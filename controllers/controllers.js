import { JobModel } from '../models/job.js'

export class JobController {
  static async getAll(request, response) {
    const { text, location, level, limit, technology, offset } = request.query
    const result = await JobModel.getAll({ text, location, level, limit, technology, offset })
    return response.json(result)
  }

  static async getById(request, response) {
    const { id } = request.params
    const job = await JobModel.getById({ id })

    if (!job) {
      return response.status(404).json({ message: "job not found" })
    }

    return response.json(job)
  }

  static async create(request, response) {
    const { titulo, empresa, ubicacion, data } = request.body
    const newJob = await JobModel.create({ input: { titulo, empresa, ubicacion, data } })
    return response.status(201).json(newJob)
  }

  static async replace(request, response) {
    // Implementar lógica de reemplazo completo
  }

  static async update(request, response) {
    const { id } = request.params
    const input = request.body
    const job = await JobModel.update({ id, input })

    if (!job) {
      return response.status(404).json({ message: "job not found" })
    }

    return response.json(job)
  }

  static async remove(request, response) {
    const { id } = request.params
    const job = await JobModel.delete({ id })

    if (!job) {
      return response.status(404).json({ message: "job not found" })
    }

    return response.status(204).send()
  }
}