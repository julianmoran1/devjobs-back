const isProduction = process.env.NODE_ENV === 'production'

export const CONFIG = {
  MODEL_AI: process.env.MODEL_AI ?? (isProduction ? 'openai/gpt-oss-120b' : 'llama3.2:latest')
}