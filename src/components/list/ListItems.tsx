import React, { useState, useEffect } from 'react'
import {
  getMonthlyExpenses,
  MonthlyExpenses,
  Expense
} from 'src/api/MonthlyExpenses'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { dateState } from 'src/recoil/DateState'
import { theme } from 'style/index'
import { EditModal, DeleteExpense } from 'components/common/index'
import { PencilAltIcon } from '@heroicons/react/solid'
import { Loading } from 'components/common/index'

export default function ListItems() {
  const monthFilter = useRecoilValue<number>(dateState)
  const [monthExpenses, setMonthExpenses] = useState<MonthlyExpenses[]>([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense>({} as Expense)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getExpenses = async () => {
      const year: number = new Date().getFullYear()
      const userId: string = 'team1'

      setIsLoading(true)

      const res = await getMonthlyExpenses(year, monthFilter, userId)
      setMonthExpenses(res)

      setTimeout(() => {
        setIsLoading(false)
      }, 300)
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

  const handleUpdate = (updatedExpense: Expense) => {
    const updatedMonthExpenses = { ...monthExpenses }

    Object.keys(updatedMonthExpenses).forEach(date => {
      const expenses = updatedMonthExpenses[date].map(expense =>
        expense._id === updatedExpense._id ? updatedExpense : expense
      )

      updatedMonthExpenses[date] = expenses
    })

    setMonthExpenses(updatedMonthExpenses)
  }

  const handleDeleteExpense = (deletedExpenseId: string) => {
    const updatedMonthExpenses = { ...monthExpenses }

    Object.keys(updatedMonthExpenses).forEach(date => {
      const updatedExpenses = updatedMonthExpenses[date].filter(
        expense => expense._id !== deletedExpenseId
      )

      updatedMonthExpenses[date] = updatedExpenses
    })

    setMonthExpenses(updatedMonthExpenses)
  }

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense)

    setEditModalOpen(true)
  }

  return (
    <Wrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <ExpenseList>
          {Object.keys(monthExpenses).length > 0 ? (
            <>
              {Object.keys(monthExpenses).map(date => {
                const expenses = monthExpenses[date]
                const { income, spend } = sumAmountByDate(monthExpenses, date)
                return (
                  <div key={date}>
                    <DateRow>
                      <MonthDate>
                        {monthFilter}월 {date}일
                      </MonthDate>
                      <Title style={{ color: 'red' }}>수입: {income}원</Title>
                      <Title style={{ color: 'blue' }}>지출: {spend}원</Title>
                      <Title>합계: {income + spend}원</Title>
                    </DateRow>
                    {expenses.map((expense, index) => (
                      <React.Fragment key={expense._id}>
                        <CategoryRow>
                          <Category>{expense.category}</Category>
                          <History>내역</History>
                          <Expenditure
                            style={{
                              color: expense.amount > 0 ? 'red' : 'blue'
                            }}>
                            {expense.amount}원
                          </Expenditure>

                          <ModifyButton
                            onClick={() => handleEditExpense(expense)}>
                            <PencilAltIcon />
                          </ModifyButton>

                          <DeleteExpense
                            expenseId={expense._id}
                            onDelete={() => handleDeleteExpense(expense._id)}
                          />
                        </CategoryRow>
                        {index < expenses.length - 1 && (
                          <LineContainer>
                            <Line />
                          </LineContainer>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )
              })}
            </>
          ) : (
            <ErrorMsg>내역이 없습니다.</ErrorMsg>
          )}
          {editModalOpen && (
            <EditModal
              closeModal={() => setEditModalOpen(false)}
              expense={selectedExpense}
              onUpdateExpense={handleUpdate}
            />
          )}
        </ExpenseList>
      )}
    </Wrapper>
  )
}
const Wrapper = styled.div`
  background-color: #f4f4f5;
`

const ExpenseList = styled.div`
  width: 80%;
  height: 720px;
  border: 2px solid #5ab400;
  margin: 50px auto;
  overflow: auto;
  background-color: white;
  border-radius: 10px;

  @media ${theme.laptop} {
    width: 60%;
  }

  @media ${theme.desktop} {
    width: 40%;
  }
  @media ${theme.tablet} {
    width: 70%;
  }

  @media ${theme.mobile} {
    width: 90%;
  }
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
  margin-left: 20px;
  font-weight: bold;
  font-size: 16px;

  @media ${theme.mobile} {
    font-size: 14px;
  }
`

const CategoryRow = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 10px;
`

const Title = styled.span`
  font-weight: bold;
  font-size: 13px;
  width: 120px;
  font-weight: 500;

  @media ${theme.desktop} {
    width: 100px;
  }

  @media ${theme.laptop} {
    width: 110px;
  }

  @media ${theme.tablet} {
    width: 100px;
  }

  @media ${theme.mobile} {
    font-size: 12px;
    width: 90px;
  }
`

const Category = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  margin-right: 10px;
  color: white;
  font-size: 13px;
  width: 60px;
  height: 20px;
  background-color: #5ab400;
  border-radius: 15px;
`

const History = styled.div`
  font-weight: bold;
  color: grey;
  font-size: 13px;

  @media ${theme.mobile} {
    font-size: 12px;
  }
`

const Expenditure = styled.div`
  margin-left: auto;
  font-weight: bold;
  color: blue;
  margin-right: 10px;
  font-size: 13px;
  font-weight: 500;

  @media ${theme.mobile} {
    font-size: 12px;
  }
`

const ErrorMsg = styled.div`
  display: flex;
  font-weight: bold;
  font-size: 32px;
  justify-content: center;
  margin-top: 50px;
`
const Line = styled.hr`
  width: 90%;
  border: 1px solid grey;
  margin: auto 0;
`
const LineContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`
const ModifyButton = styled.button`
  margin-right: 5px;
  text-decoration: none;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: white;
  svg {
    width: 20px;
    &:hover {
      cursor: pointer;
    }
  }
`
