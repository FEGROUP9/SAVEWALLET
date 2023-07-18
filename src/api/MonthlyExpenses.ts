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
    return response.data
  } catch (error) {
    console.warn(error)
    console.warn('조회실패')
    return []
  }
}

export interface MonthlyExpenses {
  [date: string]: Expense[]
}

export interface Expense {
  amount: number
  userId: string
  category: string
  date: string
  _id: string
}
