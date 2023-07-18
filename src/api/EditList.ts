import saveWallet from './axios'

export const EditExpenseList = async (
  _id: string,
  updatedExpense: Expense
): Promise<Expense | boolean> => {
  try {
    const response = await saveWallet({
      method: 'PUT',
      url: `/expenses/${_id}`,
      data: updatedExpense
    })

    return response.data
  } catch (error) {
    console.warn(error)
    console.warn('수정 실패')
    return false
  }
}

export interface Expense {
  _id: string
  amount: number
  userId: string
  category: string
  date: string
  __v: number
}
