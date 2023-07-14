import axios from 'axios'
//axios.defaults.baseURL = import.meta.env.VITE_BASE_URL - url빼두기, headers생략
//변수명 - baseInstance
export const saveWallet = axios.create({
  baseURL: 'http://52.78.195.183:3003/api',
  headers: {
    'content-type': 'application/json'
  }
})
