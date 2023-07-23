import styled from 'styled-components'

// 차트 하단에 출력할 ChartList에서 사용하는 props type 정의
type ChartListItem = {
  date: string
  category: string
  subCategory: string
  amount: number
}

type ChartListProps = {
  categoryExpenses: ChartListItem[]
}

// Styled-components 스타일링
const ChartListWrapper = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid ${props => props.theme.colors.text_secondary};
  font-family: 'TheJamsil1Thin';
  font-size: 20px;
  background-color: #fff;

  h3 {
    margin-left: 15px;
    font-weight: bold;
  }

  div {
    p {
      &:last-child {
        font-weight: bold;
        color: ${props => props.theme.colors.primary};
      }
    }
  }

  p {
    margin-right: 15px;
  }

  /* @media ${props => props.theme.mobile} {
    div {
      display: flex;
      flex-direction: row-reverse;
    }
  } */
`

export const ChartList: React.FC<ChartListProps> = ({ categoryExpenses }) => {
  const compareDates = (a: ChartListItem, b: ChartListItem) => {
    // ChartList의 내역 날짜 비교
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  }

  // categoryExpenses 배열을 날짜 순으로(최신 날짜가 상단으로) 정렬
  const sortedExpenses = categoryExpenses.sort(compareDates)

  return (
    <>
      <ChartListWrapper>
        <ul>
          {sortedExpenses.map(expense => {
            const date = new Date(expense.date)
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDate()
            const formattedDate =
              // month, day를 두 자리 수로 출력
              `${year}.${month < 10 ? '0' : ''}${month}.${
                day < 10 ? '0' : ''
              }${day}`

            return (
              <ListItem key={expense.date}>
                <h3>{formattedDate}</h3>
                <div>
                  <p>{expense.category}</p>
                  <p>{expense.subCategory}</p>
                </div>
                <p>{expense.amount.toLocaleString()}원</p>
              </ListItem>
            )
          })}
        </ul>
      </ChartListWrapper>
    </>
  )
}
