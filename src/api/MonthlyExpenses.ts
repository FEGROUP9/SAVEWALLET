import saveWallet from './axios'

export const getMonthlyExpenses = async (
  year: number,
  month: number,
  userId: string
): Promise<MonthlyExpenses[]> => {
  try {
    const response = await saveWallet({
      method: 'GET',
      url: `/calendar?year=${year}&month=${month}&userId=${userId}`
    })
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
}
