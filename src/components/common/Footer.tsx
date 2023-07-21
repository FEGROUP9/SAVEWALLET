import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'

export const Footer = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const pathFinder = (p: string) => {
    const isCurrent = p === location.pathname
    if (isCurrent) {
      return 'active'
    }
  }

  return (
    <Wrapper>
      <Title
        onClick={() => navigate('/list')}
        className={pathFinder('/list')}>
        내역
      </Title>
      <Title
        onClick={() => navigate('/calendar')}
        className={pathFinder('/calendar')}>
        달력
      </Title>
      <Title
        onClick={() => navigate('/chart')}
        className={
          location.pathname === '/chart'
            ? pathFinder('/chart')
            : pathFinder('/subchart')
        }>
        차트
      </Title>
      <Title
        onClick={() => navigate('/logaccount')}
        className={pathFinder('/logaccount')}>
        입력
      </Title>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  left: 0;
  width: 100%;
  margin-bottom: 5px;
  background-color: #f4f4f5;
`

const Title = styled.div`
  height: 8vh;
  width: 10vw;
  font-size: 22px;
  font-weight: 300;
  margin: 22px;
  text-align: center;
  line-height: 8vh;
  border-radius: 10px;
  background-color: #fff;

  &:hover {
    cursor: pointer;
  }
  &.active {
    background-color: #f15441;
    color: #fff;
    font-weight: 700;
  }
`
