import { MenuIcon, CalendarIcon, ViewListIcon } from '@heroicons/react/outline'
import { ChartBarIcon } from '@heroicons/react/solid'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMonthlyExpenses, MonthlyExpenses } from 'src/api/MonthlyExpenses'
import { SlideMenu } from '@/components/home/SlideMenu'
import axios from 'axios'

export const Home = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  let id = localStorage.getItem('id')

  const [monthAmount, setMonthAmount] = useState<MonthlyExpenses[]>([])

  const now = dayjs()
  const [thisMonth] = useState(now.format('YYYY.MM.DD'))
  const [today] = useState(thisMonth.slice(-2))
  const [currentTab, clickTab] = useState(0)
  const [isMenuOpen, setisMenuOpen] = useState(false)

  const [todayExpense, settodayExpense] = useState(0)
  const [todayIncome, settodayIncome] = useState(0)
  const [thisMonthExpense, setthisMonthExpense] = useState(0)
  const [thisMonthIncome, setthisMonthIncome] = useState(0)

  //사용자 아이디 받아오기
  const headers = {
    'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
  const request = axios.create({
    baseURL: 'https://kapi.kakao.com/',
    headers
  })
  const getUserid = async () => {
    try {
      const { data } = await request.get('/v2/user/me')
      localStorage.setItem('id', data.id)
      id = localStorage.getItem('id')
      getExpenses(id)
      return data
    } catch (error) {
      console.warn(error)
      console.warn('fail')
      alert('로그인이 필요합니다')
      navigate('/signin')
      return false
    }
  }

  const getExpenses = async id => {
    try {
      const year: number = Number(thisMonth.slice(0, 4))
      const month: number = Number(thisMonth.slice(5, 7))
      const res = await getMonthlyExpenses(year, month, `team9-${id}`)
      setMonthAmount(res)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    if (token && !id) {
      getUserid()
    }
  }, [])

  //월 데이터 받아오기
  useEffect(() => {
    if (id) {
      getExpenses(id)
    }
  }, [])

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

  //오늘 지출, 수입
  const getTodayExpense = () => {
    let negativeTodayAmount = 0
    let positiveTodayAmount = 0
    const todayAmount = monthAmount[today]
    if (todayAmount) {
      const amounts = todayAmount.reduce(
        (result, item) => {
          if (item.amount < 0) {
            result.negativeTodayAmount += item.amount
          } else {
            result.positiveTodayAmount += item.amount
          }
          return result
        },
        { negativeTodayAmount, positiveTodayAmount }
      )
      negativeTodayAmount = amounts.negativeTodayAmount
      positiveTodayAmount = amounts.positiveTodayAmount

      settodayExpense(negativeTodayAmount)
      settodayIncome(positiveTodayAmount)
    }
  }

  //이번달 지출, 수입
  const getMonthExpense = () => {
    let positiveMonthAmount = 0
    let negativeMonthAmount = 0
    if (monthAmount) {
      Object.keys(monthAmount).map(date => {
        const expenses = monthAmount[date]
        expenses.map(expense => {
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
    if (Object.keys(monthAmount).length > 0) {
      getTodayExpense()
      getMonthExpense()
    }
  }, [monthAmount])

  const handleSelectTab = (index: number) => {
    clickTab(index)
  }

  const handleOpenMenu = () => {
    setisMenuOpen(true)
  }

  const handleCloseMenu = () => {
    setisMenuOpen(false)
  }

  const handleClickNavButton = event => {
    if (id) {
      const target = event.currentTarget.innerText
      if (target == '지출 내역') {
        navigate('/list')
      } else if (target == '달력') {
        navigate('/calendar')
      } else if (target == '지출 분석') {
        navigate('/chart')
      } else if (target == '+ 내역 추가') {
        navigate('/logaccount')
      }
    } else {
      alert('로그인이 필요합니다.')
      navigate('/signin')
    }
  }

  return (
    <Wrapper>
      <MenuButton onClick={handleOpenMenu}>
        <MenuIcon />
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
        <NavButton onClick={handleClickNavButton}>
          <ViewListIcon />
          지출 내역
        </NavButton>
        <NavButton onClick={handleClickNavButton}>
          <CalendarIcon />
          달력
        </NavButton>
        <NavButton onClick={handleClickNavButton}>
          <ChartBarIcon />
          지출 분석
        </NavButton>
      </Nav>
      <AddButton onClick={handleClickNavButton}>+ 내역 추가</AddButton>
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
  font-family: 'TheJamsil5Bold';
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

const NavButton = styled.div`
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

const AddButton = styled.button`
  flex-shrink: 0;
  width: 80%;
  height: 64px;
  background-color: #f15441;
  border: none;
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
