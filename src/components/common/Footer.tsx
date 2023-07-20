import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'

export const Footer = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Wrapper>
      <Title
        onClick={() => navigate('/list')}
        className={location.pathname === '/list' ? 'active' : ''}>
        내역
      </Title>
      <Title
        onClick={() => navigate('/calender')}
        className={location.pathname === '/calender' ? 'active' : ''}>
        달력
      </Title>
      <Title
        onClick={() => navigate('/chart')}
        className={location.pathname === '/chart' ? 'active' : ''}>
        차트
      </Title>
      <Title
        onClick={() => navigate('/logaccount')}
        className={location.pathname === '/logaccount' ? 'active' : ''}>
        입력
      </Title>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  margin-bottom: 5px;
`

const Title = styled.div`
  height: 8vh;
  width: 10vw;
  font-size: 28px;
  margin: 2px;
  text-align: center;
  line-height: 8vh;
  border-radius: 10px;
  background-color: #bbb5b5;
  &:hover {
    cursor: pointer;
  }
  &.active {
    background-color: #f15441;
  }
`
