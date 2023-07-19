import { useRecoilState } from 'recoil'
import { dateState } from 'src/recoil/DateState'
import styled from 'styled-components'

export default function Month() {
  const [monthFilter, setMonthFilter] = useRecoilState<number>(dateState)
  // 버튼을 누르고나면 리코일에 현재 값이 전달됩니다.

  const handlePrevMonth = () => {
    setMonthFilter(prevMonth => (prevMonth === 1 ? 12 : prevMonth - 1))
  }

  const handleNextMonth = () => {
    setMonthFilter(nextMonth => (nextMonth === 12 ? 1 : nextMonth + 1))
  }

  return (
    <MonthLabel>
      <Button onClick={handlePrevMonth}></Button>
      <CurMonth>{monthFilter}월</CurMonth>
      <Button onClick={handleNextMonth}></Button>
    </MonthLabel>
  )
}

const MonthLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`

const Button = styled.button``
const CurMonth = styled.div`
  font-weight: bold;
  font-size: 20px;
`
