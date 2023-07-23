import { baseInstance } from 'api/axios'

const keyword = ''
const userId = 'team9-2914827908'

export const fetchExpenses = async () => {
  try {
    const res = await baseInstance({
      method: 'GET',
      url: `/expenses/search?q=${keyword}&userId=${userId}`
    })
    const data = res.data
    return data
  } catch (error) {
    console.log(error)
  }
}
