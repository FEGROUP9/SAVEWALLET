//home ts오류 수정버전
//병합충돌날까봐 파일 임시로 따로생성

import { baseInstance } from 'api/index'

export const getMonthlyExpenses = async (
  year: number,
  month: number,
  userId: string
): Promise<MonthlyExpenses> => {
  try {
    const response = await baseInstance({
      method: 'GET',
      url: `/expenses/calendar?year=${year}&month=${month}&userId=${userId}`
    })
    return response.data
  } catch (error) {
    console.warn(error)
    console.warn('조회실패')
    return {}
  }
}

export interface MonthlyExpenses {
  [date: string]: Expense[]
}

export interface Expense {
  _id: string
  amount: number
  userId: string
  category: string
  date: string
  __v: number
}
