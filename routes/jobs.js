import { Router } from "express"
import { JobController } from "../controllers/controllers.js"

export const jobsRouter = Router()

jobsRouter.get('/', JobController.getAll)
jobsRouter.get('/:id', JobController.getById)
jobsRouter.post('/', JobController.create)
jobsRouter.put('/:id', JobController.replace)
jobsRouter.patch('/:id', JobController.update)
jobsRouter.delete('/:id', JobController.remove)