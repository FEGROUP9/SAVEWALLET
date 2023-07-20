import axios from 'axios'

const baseURL =
  import.meta.env.VITE_API_BASE_URL || 'http://52.78.195.183:3003/api'

export const baseInstance = axios.create({
  baseURL
})
