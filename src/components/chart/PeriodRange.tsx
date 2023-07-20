import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    margin: 0 25px;
    font-size: 23px;
  }
`

const StyledLeftIcon = styled(ChevronLeftIcon)`
  width: 30px;
`

const StyledRightIcon = styled(ChevronRightIcon)`
  width: 30px;
`

export const PeriodRange = ({
  selectedDate,
  handlePrevMonth,
  handleNextMonth
}) => {
  return (
    <div>
      <Wrapper>
        <StyledLeftIcon onClick={handlePrevMonth} />
        <p>
          {selectedDate.year}년 {selectedDate.month}월
        </p>
        <StyledRightIcon onClick={handleNextMonth} />
      </Wrapper>
    </div>
  )
}
