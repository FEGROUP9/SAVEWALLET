import axios from 'axios'

export const saveWallet = axios.create({
  baseURL: 'http://52.78.195.183:3003/api',
  headers: {
    'content-type': 'application/json'
  }
})
