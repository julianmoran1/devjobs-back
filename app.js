import express from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import 'dotenv/config'
import { jobsRouter } from './routes/jobs.js'
import { aiRouter } from './routes/ai.js'

const PORT = process.env.PORT ?? 1234
const app = express()
app.use(corsMiddleware())
app.use(express.json())

app.get('/', (request, response) => {
  return response.send('Punto de entrada')
})

app.use('/jobs', jobsRouter)
app.use('/ia', aiRouter)

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`servidor levantado en http://localhost:${PORT}`)
  })
}

export default app