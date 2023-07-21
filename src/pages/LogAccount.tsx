import styled from 'styled-components'
import { useState, KeyboardEvent } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import dayjs, { Dayjs } from 'dayjs'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import { logExpense } from '@/api/LogAccount'

export const LogAccount = () => {
  const id = localStorage.getItem('id')
  const USERID = `team9-${id}`

  //로그인 병합전 임시
  // const USERID = `team9-2914827908`

  const now = dayjs()
  const [today] = useState(now)
  const [expense, setExpense] = useState('')
  const [account, setAccount] = useState('')
  const [selectAmount, setselectAmount] = useState(true)
  const [selectCategory, setselectCategory] = useState('카테고리')
  const [date, setDate] = useState<Dayjs | null>(dayjs(today))
  const [time, setTime] = useState<Dayjs | null>(dayjs(today))

  const navigate = useNavigate()

  const inputNumberFormat = (event: KeyboardEvent<HTMLInputElement>) => {
    setExpense(comma(uncomma(event.currentTarget.value)))
  }

  const comma = (str: string) => {
    str = String(str)
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')
  }

  const uncomma = (str: string) => {
    str = String(str)
    return str.replace(/[^\d]+/g, '')
  }

  const handleChangeExpenseInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExpense(event.target.value)
  }

  const handleChangeAccountInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAccount(event.target.value)
  }

  const handleClickAmount = () => {
    setselectAmount(!selectAmount)
  }

  const handleSelectCategory = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setselectCategory(event.target.value)
  }

  const handleClickSaveButton = () => {
    let calculatedAmount = 0
    if (selectAmount) {
      calculatedAmount = -1 * Number(uncomma(expense))
    } else {
      calculatedAmount = Number(uncomma(expense))
    }

    const totalCategory = selectCategory + '.' + account
    const dateFormat = dayjs(date).format('YYYY-MM-DD')
    const timeFormat = dayjs(time).format('HH:mm:ss')
    const fullDate = String(dayjs(dateFormat + timeFormat).add(9, 'hour'))

    if (
      calculatedAmount !== 0 &&
      selectCategory !== '카테고리' &&
      account.length > 0
    ) {
      requestAddExpense(calculatedAmount, USERID, totalCategory, fullDate)
      navigate('/')
    } else {
      alert('빠진 항목 없이 입력해주세요.')
    }
  }

  const requestAddExpense = async (
    expense: number,
    userid: string,
    category: string,
    date: string
  ) => {
    await logExpense(expense, userid, category, date)
  }

  return (
    <Wrapper>
      <Header>
        <NavLink to="/">
          <ArrowLeftIcon />
        </NavLink>
        지출/수입 입력
      </Header>
      <ExpenseBoard>
        <input
          type="text"
          value={expense}
          onChange={handleChangeExpenseInput}
          onKeyUp={inputNumberFormat}
        />
        <span className="monetary-unit">원</span>
      </ExpenseBoard>
      <ExpenseInputs>
        <ExpenseInputRow>
          <span className="label">분류</span>
          <AmountButton
            onClick={handleClickAmount}
            className={selectAmount ? 'active' : ''}>
            지출
          </AmountButton>
          <AmountButton
            onClick={handleClickAmount}
            className={selectAmount ? '' : 'active'}>
            수입
          </AmountButton>
        </ExpenseInputRow>
        <ExpenseInputRow>
          <span className="label">카테고리</span>
          <select
            name=""
            id=""
            onChange={handleSelectCategory}>
            <option value="카테고리">카테고리</option>
            <option value="식비">식비</option>
            <option value="생활/건강">생활/건강</option>
            <option value="쇼핑">쇼핑</option>
            <option value="교통">교통</option>
            <option value="주거/통신">주거/통신</option>
            <option value="금융">금융</option>
            <option value="문화/여가">문화/여가</option>
            <option value="교육/학습">교육/학습</option>
            <option value="자녀/육아">자녀/육아</option>
            <option value="경조/선물">경조/선물</option>
          </select>
        </ExpenseInputRow>
        <ExpenseInputRow>
          <span className="label">사용처</span>
          <input
            className="account-input"
            type="text"
            onChange={handleChangeAccountInput}
          />
        </ExpenseInputRow>
        <ExpenseInputRow>
          <span className="label">날짜</span>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                className="date-picker"
                format="YYYY-MM-DD"
                defaultValue={date}
                onChange={newValue => setDate(newValue)}
              />
            </LocalizationProvider>
          </ThemeProvider>
        </ExpenseInputRow>
        <ExpenseInputRow>
          <span className="label">시간</span>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileTimePicker
                className="time-picker"
                defaultValue={time}
                onChange={newValue => setTime(newValue)}
              />
            </LocalizationProvider>
          </ThemeProvider>
        </ExpenseInputRow>
      </ExpenseInputs>
      <SaveButton onClick={handleClickSaveButton}>저장</SaveButton>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  min-height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  background-color: #fff;
`

const Header = styled.div`
  width: 100%;
  height: 64px;
  max-width: 768px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-bottom: 1px solid #f15441;
  position: relative;
  svg {
    position: absolute;
    left: 10px;
    margin-top: -16px;
    width: 32px;
    height: 32px;
    color: #f15441;
  }
`

const ExpenseBoard = styled.div`
  width: 100%;
  max-width: 768px;
  height: 150px;
  display: flex;
  align-items: center;
  padding: 30px;
  box-sizing: border-box;
  background-color: #f4f4f5;
  input {
    border: none;
    background-color: transparent;
    font-size: 40px;
    text-align: right;
    width: 100%;
    border-bottom: 2px solid #f15441;
    &:focus {
      outline: none;
    }
  }
  .monetary-unit {
    font-size: 35px;
  }
`
const ExpenseInputs = styled.div`
  width: 100%;
  height: 100%;
  max-width: 768px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  box-sizing: border-box;
`

const ExpenseInputRow = styled.div`
  height: 100%;
  max-width: 768px;
  display: flex;
  align-items: center;
  .label {
    width: 120px;
    flex-shrink: 0;
  }
  .account-input {
    height: 45px;
    width: 100%;
    border: 1px solid #c4c4c4;
    border-radius: 4px;
    padding: 5px;
    &:hover {
      border: 1px solid #212121;
    }
    &:focus {
      border: 1px solid #f15441;
      outline: 1px solid #f15441;
    }
  }
  select {
    height: 55px;
    width: 200px;
    width: 100%;

    border: 1px solid #c4c4c4;
    border-radius: 4px;
    &:focus {
      border: 1px solid #f15441;
      outline: 1px solid #f15441;
    }
  }
  .date-picker {
    width: 100%;
  }
  .time-picker {
    width: 100%;
  }
`

const AmountButton = styled.button`
  width: 90px;
  height: 55px;
  border-radius: 4px;
  border: 1px solid #c4c4c4;
  background-color: #fff;
  margin-right: 5px;
  &.active {
    border: 2px solid #f15441;
  }
`

const SaveButton = styled.button`
  border: none;
  margin-top: 2rem;
  margin-bottom: 2rem;
  width: 80%;
  height: 64px;
  background-color: #f15441;
  max-width: 768px;
  font-size: 18px;
  color: #fff;
  border-radius: 6px;
`

const theme = createTheme({
  palette: {
    primary: {
      main: '#f15441',
      dark: '#f15441',
      contrastText: '#fff'
    },
    secondary: {
      main: '#f15441',
      contrastText: '#fff'
    }
  }
})
