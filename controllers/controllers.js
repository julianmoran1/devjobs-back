import { JobModel } from '../models/job.js'

export const getAll = async (request, response) => {
  const { text, location, level, limit, technology, offset } = request.query
  const result = await JobModel.getAll({ text, location, level, limit, technology, offset })
  return response.json(result)
}

export const getById = async (request, response) => {
  const { id } = request.params
  const job = await JobModel.getById({ id })
  
  if (!job) {
    return response.status(404).json({ message: "job not found" })
  }
  
  return response.json(job)
}

export const create = async (request, response) => {
  const { titulo, empresa, ubicacion, data } = request.body
  const newJob = await JobModel.create({ input: { titulo, empresa, ubicacion, data } })
  return response.status(201).json(newJob)
}

export const replace = async (request, response) => {}
export const update = async (request, response) => {}
export const remove = async (request, response) => {}