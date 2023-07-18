import {
  Bars3Icon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import { CalendarIcon, ChartPieIcon } from '@heroicons/react/24/solid'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  getMonthlyExpenses,
  MonthlyExpenses,
  Expense
} from 'src/api/MonthlyExpenses2'
import { useRecoilValue } from 'recoil'
import { dateState } from 'src/recoil/DateState'
import { SlideMenu } from '@/components/home/SlideMenu'

//아이디받아오기 임시
//import axios from 'axios'

export const Home = () => {
  //아이디 받아오기 임시
  // const headers = {
  //   'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
  //   Authorization: `Bearer ${localStorage.getItem('token')}`
  // }
  // const request = axios.create({
  //   baseURL: 'https://kapi.kakao.com/',
  //   headers
  // })
  // const getUserid = async () => {
  //   try {
  //     const { data } = await request.get('/v2/user/me')
  //     localStorage.setItem('id', data.id)
  //     return data
  //   } catch (error) {
  //     console.warn(error)
  //     console.warn('fail')
  //     return false
  //   }
  // }
  // useEffect(() => {
  //   getUserid()
  // })

  //const id = localStorage.getItem('id')
  // const USERID = `team9-${id}`

  //로그인 병합전 테스트용
  //병합 후 받아오는 아이디로 변경
  const USERID = `team9-2914827908`

  const monthFilter = useRecoilValue<number>(dateState)
  const [monthExpenses, setMonthExpenses] = useState<MonthlyExpenses>({})

  const now = dayjs()
  const [thisMonth] = useState(now.format('YYYY.MM.DD'))
  const [today] = useState(thisMonth.slice(-2))
  const [currentTab, clickTab] = useState(0)
  const [isMenuOpen, setisMenuOpen] = useState(false)

  const [todayExpense, settodayExpense] = useState(0)
  const [todayIncome, settodayIncome] = useState(0)
  const [thisMonthExpense, setthisMonthExpense] = useState(0)
  const [thisMonthIncome, setthisMonthIncome] = useState(0)

  const tabList = [
    {
      name: '지출',
      month: thisMonthExpense.toLocaleString('ko-KR'),
      today: todayExpense.toLocaleString('ko-KR')
    },
    {
      name: '수입',
      month: thisMonthIncome.toLocaleString('ko-KR'),
      today: todayIncome.toLocaleString('ko-KR')
    }
  ]

  //월 데이터 받아오기
  const getExpenses = async () => {
    const year: number = Number(thisMonth.slice(0, 4))
    const userId: string = USERID
    const res = await getMonthlyExpenses(year, monthFilter, userId)
    setMonthExpenses(res)
  }
  useEffect(() => {
    getExpenses()
  }, [monthFilter])

  //오늘 지출,수입
  const getTodayExpense = () => {
    if (monthExpenses) {
      const todayExpense = monthExpenses[today]
      if (todayExpense) {
        const { negativeTodayAmount, positiveTodayAmount } =
          todayExpense.reduce(
            (result, item) => {
              if (item.amount < 0) {
                result.negativeTodayAmount += item.amount
              } else {
                result.positiveTodayAmount += item.amount
              }
              return result
            },
            { negativeTodayAmount: 0, positiveTodayAmount: 0 }
          )
        settodayExpense(negativeTodayAmount)
        settodayIncome(positiveTodayAmount)
      }
    }
  }

  //이번달 지출,수입
  const getMonthExpense = () => {
    let positiveMonthAmount = 0
    let negativeMonthAmount = 0
    if (monthExpenses) {
      Object.entries(monthExpenses).forEach(([, expenses]) => {
        expenses.forEach((expense: Expense) => {
          const amount = expense.amount
          if (amount >= 0) {
            positiveMonthAmount += amount
          } else {
            negativeMonthAmount += amount
          }
        })
      })
    }
    setthisMonthExpense(negativeMonthAmount)
    setthisMonthIncome(positiveMonthAmount)
  }

  useEffect(() => {
    getTodayExpense()
    getMonthExpense()
  })

  const handleSelectTab = (index: number) => {
    clickTab(index)
  }

  const handleOpenMenu = () => {
    setisMenuOpen(true)
  }

  const handleCloseMenu = () => {
    setisMenuOpen(false)
  }

  return (
    <Wrapper>
      <MenuButton onClick={handleOpenMenu}>
        <Bars3Icon />
      </MenuButton>
      <HeadLine>
        지출, 수입을 기록하고 <br />
        손쉽게 재정을 추적하고
        <br />
        효과적으로 관리하세요.
      </HeadLine>
      <TabMenu>
        {tabList.map((el, index) => (
          <li
            key={index}
            className={index === currentTab ? 'submenu focused' : 'submenu'}
            onClick={() => handleSelectTab(index)}>
            {el.name}
          </li>
        ))}
        <span className="date-month">{thisMonth}</span>
      </TabMenu>
      <TabContent>
        <TabContentItem>
          <span className="label">이번 달</span>
          <span className="amount">{tabList[currentTab].month}</span>
          <span className="monetary-unit">원</span>
        </TabContentItem>
        <TabContentItem>
          <span className="label">오늘</span>
          <span className="amount">{tabList[currentTab].today}</span>
          <span className="monetary-unit">원</span>
        </TabContentItem>
      </TabContent>
      <Nav>
        <NavButton to="/list">
          <ClipboardDocumentListIcon />
          지출 내역
        </NavButton>
        <NavButton to="/calender">
          <CalendarIcon />
          달력
        </NavButton>
        <NavButton to="/chart">
          <ChartPieIcon />
          지출 분석
        </NavButton>
      </Nav>
      <AddButton to="logaccount">+ 내역 추가</AddButton>
      <SlideMenu
        isMenuOpen={isMenuOpen}
        handleCloseMenu={handleCloseMenu}
      />
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
  padding: 2rem;
  background-color: #f4f4f5;
`

const MenuButton = styled.div`
  width: 24px;
  height: 24px;
  position: absolute;
  left: 10px;
  top: 10px;
  @media ${props => props.theme.tablet} {
    width: 32px;
    height: 32px;
  }
  @media ${props => props.theme.laptop} {
    width: 32px;
    height: 32px;
  }
  @media ${props => props.theme.desktop} {
    width: 32px;
    height: 32px;
  }
`

const HeadLine = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 50px;
  margin-top: 20px;
  width: 100%;
  max-width: 768px;
  position: relative;
  p {
    position: absolute;
    right: 37px;
    bottom: 0;
    font-size: 12px;
  }
  img {
    position: absolute;
    right: 0;
    bottom: -5px;
    width: 32px;
    height: 32px;
  }
`

const TabMenu = styled.ul`
  position: relative;
  width: 100%;
  height: 48px;
  flex-shrink: 0;
  max-width: 768px;
  background-color: #fff;
  color: #b7b7b7;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-items: center;
  list-style: none;
  .submenu {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100%;
    font-size: 14px;
    transition: 0.5s;
    @media ${props => props.theme.tablet} {
      width: calc(100% / 3);
      font-size: 20px;
    }
    @media ${props => props.theme.laptop} {
      width: calc(100% / 3);
      font-size: 20px;
    }
    @media ${props => props.theme.desktop} {
      width: calc(100% / 3);
      font-size: 20px;
    }
  }
  .focused {
    border-bottom: 2px solid #000;
    color: #000;
  }
  .date-month {
    position: absolute;
    font-size: 18px;
    color: #000;
    font-weight: 400;
    right: 20px;
  }
`
const TabContent = styled.div`
  flex-shrink: 0;
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  height: 180px;
  width: 100%;
  max-width: 768px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  @media ${props => props.theme.tablet} {
    height: 300px;
  }
  @media ${props => props.theme.laptop} {
    height: 300px;
  }
  @media ${props => props.theme.desktop} {
    height: 300px;
  }
`

const TabContentItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  position: relative;
  .label {
    font-size: 16px;
    font-weight: 700;
    position: absolute;
    left: 0;
    @media ${props => props.theme.tablet} {
      font-size: 30px;
    }
    @media ${props => props.theme.laptop} {
      font-size: 30px;
    }
    @media ${props => props.theme.desktop} {
      font-size: 30px;
    }
  }
  .amount {
    font-size: 32px;
    color: #f15441;
    justify-content: flex-end;
    @media ${props => props.theme.tablet} {
      font-size: 50px;
    }
    @media ${props => props.theme.laptop} {
      font-size: 50px;
    }
    @media ${props => props.theme.desktop} {
      font-size: 50px;
    }
  }
  .monetary-unit {
    font-size: 16px;
    align-self: flex-end;
    @media ${props => props.theme.tablet} {
      font-size: 30px;
    }
    @media ${props => props.theme.laptop} {
      font-size: 30px;
    }
    @media ${props => props.theme.desktop} {
      font-size: 30px;
    }
  }
`

const Nav = styled.div`
  max-width: 768px;
  flex-shrink: 0;
  margin-top: 10px;
  margin-bottom: 50px;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  height: 120px;
  box-sizing: border-box;
`

const NavButton = styled(NavLink)`
  display: flex;
  flex-direction: column;
  text-decoration: none;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  font-size: 12px;
  color: #7b7b7b;
  padding: 30px;
  svg {
    width: 40px;
  }
  &:last-child {
    border: none;
  }
`

const AddButton = styled(NavLink)`
  margin-bottom: 2rem;
  flex-shrink: 0;
  width: 80%;
  height: 64px;
  background-color: #f15441;
  max-width: 768px;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: #fff;
  border-radius: 6px;
  box-sizing: border-box;
`
