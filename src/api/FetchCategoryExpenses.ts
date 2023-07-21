import { baseInstance } from 'api/axios'

const keyword = ''
const userId = 'team10'

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
