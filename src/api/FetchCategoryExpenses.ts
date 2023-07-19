import saveWallet from 'api/axios'

const keyword = ''
const userId = 'team9'

export const fetchExpenses = async () => {
  try {
    const res = await saveWallet({
      method: 'GET',
      url: `/expenses/search?q=${keyword}&userId=${userId}`
    })
    const data = res.data
    return data
  } catch (error) {
    console.log(error)
  }
}
