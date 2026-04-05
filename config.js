const isProduction = process.env.NODE_ENV === 'production'

export const CONFIG = {
  MODEL_AI: process.env.MODEL_AI ?? (isProduction ? 'llama-3.3-70b-versatile' : 'llama3.2:latest')
}