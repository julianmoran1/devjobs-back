import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:1234',
  'http://localhost:1111',
  'https://devjobs-front-sigma.vercel.app'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
  return cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin) || !origin) {
        return callback(null, true)
      }

      if (origin && origin.includes('vercel.app') && origin.includes('devjobs-front')) {
        return callback(null, true)
      }

      return callback(new Error('Origen no permitido'))
    }
  })
}
