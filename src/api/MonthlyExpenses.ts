import { saveWallet } from 'api/index'

export const getMonthlyExpenses = async (
  year: number,
  month: number,
  userId: string
): Promise<MonthlyExpenses[]> => {
  try {
    const response = await saveWallet({
      method: 'GET',
      url: `/expenses/calendar?year=${year}&month=${month}&userId=${userId}`
    })
    console.log(response.data)
    return response.data
  } catch (error) {
    console.warn(error)
    console.warn('조회실패')
    return []
  }
}

interface MonthlyExpenses {
  amount: number
  userId: string
  category: string
  date: string
  _id: string
}
