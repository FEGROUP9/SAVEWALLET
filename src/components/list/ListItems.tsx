import React, { useState, useEffect } from 'react'
import {
  getMonthlyExpenses,
  MonthlyExpenses,
  Expense
} from 'src/api/MonthlyExpenses'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { dateState } from 'src/recoil/DateState'

export default function ListItems() {
  const monthFilter = useRecoilValue<number>(dateState)
  const [monthExpenses, setMonthExpenses] = useState<MonthlyExpenses[]>([])

  useEffect(() => {
    const getExpenses = async () => {
      const year: number = new Date().getFullYear()
      const userId: string = 'team9'
      const res = await getMonthlyExpenses(year, monthFilter, userId)
      setMonthExpenses(res) // 리코일값을 받아와 api에 월을 전달하여 불러옵니다.
    }
    getExpenses()
  }, [monthFilter])

  const sumAmountByDate = (expenses: MonthlyExpenses[], date: string) => {
    const amountArray: number[] = expenses[date].map(
      (expenses: Expense) => expenses.amount
    )
    const income: number = amountArray.reduce(
      (total: number, amount: number) => {
        if (amount > 0) {
          return total + amount
        }
        return total
      },
      0
    )

    const spend: number = amountArray.reduce(
      (total: number, amount: number) => {
        if (amount < 0) {
          return total + amount
        }
        return total
      },
      0
    )
    return {
      income,
      spend
    }
  }

  return (
    <Wrapper>
      {Object.entries(monthExpenses).length > 0 ? (
        <>
          {Object.entries(monthExpenses).map(([date, expenses]) => {
            const { income, spend } = sumAmountByDate(monthExpenses, date)
            return (
              <div key={date}>
                <DateRow>
                  <MonthDate>
                    {monthFilter}월 {date}일
                  </MonthDate>
                  <Title style={{ color: 'red' }}>수입: {income}</Title>{' '}
                  <Title style={{ color: 'blue' }}>지출: {spend}</Title>{' '}
                  <Title>합계: {income + spend}</Title>
                </DateRow>
                {expenses.map(expense => (
                  <CategoryRow key={expense._id}>
                    <Category>{expense.category}</Category>
                    <History>내역</History>
                    <Expenditure
                      style={{ color: expense.amount > 0 ? 'red' : 'blue' }}>
                      {expense.amount}
                    </Expenditure>
                  </CategoryRow>
                ))}
              </div>
            )
          })}
        </>
      ) : (
        <ErrorMsg>내역이 없습니다.</ErrorMsg>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 80%;
  height: 720px;
  border: 2px solid grey;
  margin: 50px auto;
`

const DateRow = styled.div`
  border-top: 2px solid grey;
  border-bottom: 2px solid grey;
  display: flex;
  margin: -2px;
  height: 25px;
  align-items: center;
  justify-content: flex-end;
`

const MonthDate = styled.div`
  margin-right: auto;
  margin-left: 10px;
  font-weight: bold;
`

const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 10px;
`

const Title = styled.span`
  font-weight: bold;
  width: 10%;
`
const Category = styled.div`
  font-weight: bold;
  margin-right: 10px;
  color: green;
`

const History = styled.div`
  font-weight: bold;
  color: grey;
`

const Expenditure = styled.div`
  margin-left: auto;
  font-weight: bold;
  color: blue;
`

const ErrorMsg = styled.div`
  display: flex;
  font-weight: bold;
  font-size: 32px;
  justify-content: center;
  margin-top: 50px;
`
