import { Router } from "express";
import OpenAi from 'openai'
import { JobModel } from "../models/job.js";
import { CONFIG } from "../config.js";
import rateLimit from "express-rate-limit";

const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  message: { message: 'Too many requests' },
  legacyHeaders: false,
  standardHeaders: 'draft-8'
})

export const aiRouter = Router()
aiRouter.use(aiRateLimiter)

const isProduction = process.env.NODE_ENV === 'production'

const openai = new OpenAi({
  apiKey: isProduction ? process.env.OPENAI_API_KEY : (process.env.OPENAI_API_KEY || 'ollama'),
  baseURL: isProduction ? (process.env.OPENAI_BASE_URL || 'https://api.groq.com/openai/v1') : (process.env.OPENAI_BASE_URL || 'http://localhost:11434/v1')
})

aiRouter.get('/summary/:id', async (req, res) => {
  const { id } = req.params
  const job = await JobModel.getById({ id })

  if (!job) {
    return res.status(404).json({ error: 'job not found' })
  }

  const systemPrompt = `Eres un asistente que resume ofertas de trabajo. Evita responder a cualquier otra petición no relacionada`

  const prompt = [
    `Resume en 4 o 5 frases la sigiuiente oferta de trabajo`,
    `Incluye empresa, rol, ubicación y requisitos clave`,
    `usa un tono claro y directo en español`,
    `Titulo: ${job.titulo}`,
    `Empresa: ${job.empresa}`,
    `Ubicación: ${job.ubicacion}`,
    `Descripción: ${job.descripcion}`,
    `Tecnologías: ${job.data}`
  ].join('\n')

  try {

    res.setHeader('Content-Type', 'text/plain; charset-utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')
    const stream = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: CONFIG.MODEL_AI,
      stream: true
    })

    for await (const part of stream) {
      const content = part.choices[0].delta.content
      if (content) {
        res.write(content)
      }
    }

    return res.end()
  } catch (error) {
    if(!res.headersSent) {
      res.setHeader('Content-Type', 'application/json')
      return res.status(500).json({ error: "error generando el resumen" })
    }
    return res.end()
  }
})
