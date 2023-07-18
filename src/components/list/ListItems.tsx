import React, { useState, useEffect } from 'react'
import {
  getMonthlyExpenses,
  MonthlyExpenses,
  Expense
} from 'src/api/MonthlyExpenses'
import styled from 'styled-components'
import { useRecoilValue } from 'recoil'
import { dateState } from 'src/recoil/DateState'
import { theme } from 'src/style/theme'
import { EditModal } from 'src/components/common/EditModal'
import { DeleteExpense } from 'src/components/common/DeleteItem'

export default function ListItems() {
  const monthFilter = useRecoilValue<number>(dateState)
  const [monthExpenses, setMonthExpenses] = useState<MonthlyExpenses[]>([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense>({} as Expense)

  useEffect(() => {
    const getExpenses = async () => {
      const year: number = new Date().getFullYear()
      const userId: string = 'team9'
      const res = await getMonthlyExpenses(year, monthFilter, userId) // 리코일값을 받아와 api에 월을 전달하여 불러옵니다.
      setMonthExpenses(res)
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
    // monthExpenses 배열을 map으로 순회하면서 각 날짜별 소비 목록을 업데이트합니다.
    const updatedMonthExpenses = monthExpenses.map(dateExpenses => {
      // 해당 날짜(dateExpenses)의 소비 목록에 대해 map으로 순회하면서 수정된 목록을 적용합니다.
      const updatedExpenses = dateExpenses.map(expense =>
        // _id가 일치하는 비용은 수정된 목록으로 업데이트, 그렇지 않은 목록은 그대로 둡니다.
        expense._id === updatedExpense._id ? updatedExpense : expense
      )
      // 해당 날짜(dateExpenses)의 비용 목록을 수정된 목록으로 대체하고 객체를 반환합니다.
      return { ...dateExpenses, [updatedExpenses[0].date]: updatedExpenses }
    })

    // 수정된 monthExpenses로 상태를 업데이트합니다.
    setMonthExpenses(updatedMonthExpenses)
  }

  const handleEditExpense = (expense: Expense) => {
    // 선택된 비용 정보를 selectedExpense 상태로 설정합니다.
    setSelectedExpense(expense)
    // 모달 창을 엽니다.
    setEditModalOpen(true)
  }

  const handleDeleteExpense = (deletedExpenseId: string) => {
    // monthExpenses 배열을 map으로 순회하면서 각 날짜별 소비 목록을 업데이트합니다.
    const updatedMonthExpenses = monthExpenses.map(dateExpenses => {
      // 해당 날짜(dateExpenses)의 키(date)를 가져옵니다.
      const date = Object.keys(dateExpenses)[0]
      // 해당 날짜(dateExpenses)의 소비 목록에서 삭제할 소비를 제거합니다.
      const updatedExpenses = dateExpenses[date].filter(
        expense => expense._id !== deletedExpenseId
      )
      // 해당 날짜(dateExpenses)의 소비 목록을 수정된 목록으로 대체하고 객체를 반환합니다.
      return { ...dateExpenses, [date]: updatedExpenses }
    })

    // 수정된 monthExpenses로 상태를 업데이트합니다.
    setMonthExpenses(updatedMonthExpenses)
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
                      <button onClick={() => handleEditExpense(expense)}>
                        수정
                      </button>

                      <DeleteExpense
                        expenseId={expense._id}
                        onDelete={() => handleDeleteExpense(expense._id)}
                      />
                    </CategoryRow>
                    {index < +expenses.length - 1 && (
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
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 80%;
  height: 720px;
  border: 2px solid grey;
  margin: 50px auto;

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
  margin-left: 10px;
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
  font-weight: bold;
  margin-right: 10px;
  color: green;
  font-size: 16px;

  @media ${theme.mobile} {
    font-size: 14px;
  }
`

const History = styled.div`
  font-weight: bold;
  color: grey;
  font-size: 14px;

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

  @media ${theme.desktop} {
    width: 90%;
  }

  @media ${theme.laptop} {
    width: 90%;
  }

  @media ${theme.tablet} {
    width: 90%;
  }

  @media ${theme.mobile} {
    width: 90%;
  }
`
const LineContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`
