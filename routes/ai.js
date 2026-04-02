import { Router } from "express";
import OpenAi from 'openai'
import { JobModel } from "../models/job.js";
import { CONFIG } from "../config.js";

export const aiRouter = Router()

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
    const completion = await openai.chat.completions.create({
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
      model: CONFIG.MODEL_AI
    })
    console.log("respuesta ia", completion)
    const summary = completion.choices?.[0]?.message?.content?.trim() || null
    if (!summary) {
      return res.status(500).json({ error: "no se generó resumen" })
    }

    res.json({ summary })
  } catch (error) {
    console.error('Error generando resumen:', error.message)
    res.status(500).json({ error: "error generando el resumen" })
  }
})