import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import styled from 'styled-components'
import { Header, Footer } from 'components/index'

const events = [{ title: 'Meeting', start: new Date() }]

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  @media ${props => props.theme.mobile} {
    .fc {
      width: 100%;
      margin: 0 auto;
    }
    // toolbar container
    .fc .fc-toolbar.fc-header-toolbar {
      margin: 0;
      padding: 0 40px;
      background-color: #f15441;
      height: 63px;
      font-weight: 600;
      font-size: 12px;
      line-height: 29px;
      color: white;
      border-radius: 20px 20px 0px 0px;
    }

    // toolbar 버튼
    .fc .fc-button-primary {
      background-color: transparent;
      border: none;

      span {
        font-weight: 500;
        font-size: 28px;
      }

      :hover {
        background-color: transparent;
      }
    }
  }
  @media ${props => props.theme.desktop} {
    .fc {
      width: 100%;
      margin: 0 100px;
    }

    // toolbar container
    .fc .fc-toolbar.fc-header-toolbar {
      margin: 0;
      padding: 0 40px;
      background-color: #f15441;
      height: 63px;
      font-weight: 600;
      font-size: 12px;
      line-height: 29px;
      color: white;
      border-radius: 20px 20px 0px 0px;
    }

    // toolbar 버튼
    .fc .fc-button-primary {
      background-color: transparent;
      border: none;

      span {
        font-weight: 500;
        font-size: 28px;
      }

      :hover {
        background-color: transparent;
      }
    }
  }
`

export const Calender = () => {
  return (
    <>
      <Header />
      <Wrapper>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          weekends={false}
          events={events}
        />
      </Wrapper>
      <Footer />
    </>
  )
}
