import { Router } from "express"
import { create, getAll, getById, remove, replace, update } from "../controllers/controllers.js"

export const jobsRouter = Router()

jobsRouter.get('/', getAll)
jobsRouter.get('/:id', getById)
jobsRouter.post('/', create )
jobsRouter.put('/:id', replace)
jobsRouter.patch('/:id', update)
jobsRouter.delete('/:id', remove)