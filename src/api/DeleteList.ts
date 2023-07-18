import saveWallet from './axios'

export const DeleteExpenseList = async (_id: string): Promise<boolean> => {
  try {
    await saveWallet({
      method: 'DELETE',
      url: `/expenses/${_id}`
    })
    return true
  } catch (error) {
    console.warn(error)
    console.warn('삭제 실패')
    return false
  }
}
