import saveWallet from './axios'

export const getExpensesSummary = async (
  period: string,
  userId: string
): Promise<ExpenseSummary[]> => {
  try {
    const response = await saveWallet({
      method: 'GET',
      url: `/summary?period=${period}&userId=${userId}`
    })
    return response.data
  } catch (error) {
    console.warn(error)
    console.warn('조회실패')
    return []
  }
}

interface ExpenseSummary {
  _id: string
  totalAmount: number
}
