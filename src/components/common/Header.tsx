import styled from 'styled-components'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { useNavigate } from 'react-router-dom'
const Wrapper = styled.div`
  display: flex;
  .backwards {
    width: 24px;
    height: 24px;
    margin: auto 0;
    padding: 0 20px;
    cursor: pointer;
  }
  .pathname {
    vertical-align: baseline;
    font-size: 40px;
    letter-spacing: -2px;
  }
  @media ${props => props.theme.mobile} {
  }
  @media ${props => props.theme.tablet} {
  }
  @media ${props => props.theme.laptop} {
  }
  @media ${props => props.theme.desktop} {
  }
`

export const Header = () => {
  let navigate = useNavigate()
  return (
    <Wrapper>
      <a
        className="backwards"
        onClick={() => {
          navigate(-1)
        }}>
        <ChevronLeftIcon />
      </a>
      <div className="pathname">
        {window.location.pathname.replace('/', '').toUpperCase()}
      </div>
    </Wrapper>
  )
}
