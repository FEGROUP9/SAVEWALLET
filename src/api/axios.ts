import axios from 'axios'

const baseURL =
  import.meta.env.VITE_API_BASE_URL || 'https://chickenlecture.xyz/api'

export const baseInstance = axios.create({
  baseURL
})
