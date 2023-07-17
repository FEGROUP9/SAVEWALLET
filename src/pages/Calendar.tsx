import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import _ from 'lodash'
import styled from 'styled-components'
import { Header, Footer } from 'components/index'
import { useEffect, useState, useRef } from 'react'
import { getMonthlyExpenses } from 'api/index'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  .fc {
    width: 100%;
  }

  @media ${props => props.theme.mobile} {
    .fc {
      margin: 0 30px;
      height: 500px;
    }
    // toolbar container
    .fc .fc-toolbar.fc-header-toolbar {
      margin: 0;
      padding: 25px 40px;
      background-color: #f15441;
      height: 33px;
      font-weight: 600;
      font-size: 10px;
      line-height: 29px;
      color: white;
      border-radius: 20px 20px 0px 0px;
    }

    // toolbar 버튼
    .fc .fc-button-primary {
      background-color: transparent;
      border: none;

      span {
        font-weight: 300;
        font-size: 20px;
      }
    }
    // 요일 부분
    .fc-theme-standard th {
      height: 16px;
      padding-top: 1px;
      background: #f4968b;
      border-top: 1px solid #fefefe;
      font-weight: 500;
      font-size: 12px;
      line-height: 17px;
      color: #f8f8f8;
    }
    // 오늘 날짜 배경색
    .fc .fc-daygrid-day.fc-day-today {
      background-color: #fff8bd;
      color: #f15441;
    }

    // 날짜별 그리드
    .fc .fc-daygrid-day-frame {
      padding: 4px;
      height: 50px;
    }

    // 날짜  ex) 2일
    .fc .fc-daygrid-day-top {
      flex-direction: row;
      margin-bottom: 1px;
      font-size: 11px;
    }
    // 각 이벤트 요소
    .fc-event {
      cursor: pointer;
      padding: 3px 5px;
      margin-bottom: 5px;
      border-radius: 4px;
      font-weight: 500;
      font-size: 11px;
      overflow: scroll;
    }
  }
  @media ${props => props.theme.tablet} {
    .fc {
      margin: 0 50px;
      height: 800px;
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
    }
    // 요일 부분
    .fc-theme-standard th {
      height: 32px;
      padding-top: 3px;
      background: #f4968b;
      border-top: 1px solid #fefefe;
      font-weight: 500;
      font-size: 17px;
      line-height: 20px;
      color: #f8f8f8;
    }
    // 오늘 날짜 배경색
    .fc .fc-daygrid-day.fc-day-today {
      background-color: #fff8bd;
      color: #f15441;
    }

    // 날짜별 그리드
    .fc .fc-daygrid-day-frame {
      padding: 8px;
      height: 50px;
      width: 60px;
    }

    // 날짜  ex) 2일
    .fc .fc-daygrid-day-top {
      flex-direction: row;
      margin-bottom: 1px;
      font-size: 16px;
    }
    // 각 이벤트 요소
    .fc-event {
      cursor: pointer;
      padding: 3px 5px;
      margin-bottom: 5px;
      border-radius: 4px;
      font-weight: 500;
      font-size: 13px;
      overflow: scroll;
    }
  }
  @media ${props => props.theme.laptop} {
    .fc {
      height: 900px;
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
    }
    // 요일 부분
    .fc-theme-standard th {
      height: 32px;
      padding-top: 3px;
      background: #f4968b;
      border-top: 1px solid #fefefe;
      font-weight: 500;
      font-size: 17px;
      line-height: 20px;
      color: #f8f8f8;
    }
    // 오늘 날짜 배경색
    .fc .fc-daygrid-day.fc-day-today {
      background-color: #fff8bd;
      color: #f15441;
    }

    // 날짜별 그리드
    .fc .fc-daygrid-day-frame {
      padding: 8px;
      height: 50px;
    }

    // 날짜  ex) 2일
    .fc .fc-daygrid-day-top {
      flex-direction: row;
      margin-bottom: 2px;
      font-size: 16px;
    }
    // 각 이벤트 요소
    .fc-event {
      cursor: pointer;
      padding: 3px 5px;
      margin-bottom: 5px;
      border-radius: 4px;
      font-weight: 500;
      font-size: 13px;
      overflow: scroll;
    }
  }
  @media ${props => props.theme.desktop} {
    .fc {
      margin: 0 150px;
      height: 1200px;
    }

    // toolbar container
    .fc .fc-toolbar.fc-header-toolbar {
      margin: 0;
      padding: 0 40px;
      background-color: #f15441;
      height: 77px;
      font-weight: 600;
      font-size: 12px;
      line-height: 29px;
      color: white;
      border-radius: 20px 20px 0px 0px;
      justify-content: space-evenly;
    }

    // toolbar 버튼
    .fc .fc-button-primary {
      background-color: transparent;
      border: none;

      span {
        font-weight: 500;
        font-size: 28px;
      }
    }
    // 요일 부분
    .fc-theme-standard th {
      height: 32px;
      padding-top: 3px;
      background: #f4968b;
      border-top: 1px solid #fefefe;
      font-weight: 500;
      font-size: 17px;
      line-height: 20px;
      color: #f8f8f8;
    }
    // 오늘 날짜 배경색
    .fc .fc-daygrid-day.fc-day-today {
      background-color: #fff8bd;
      color: #f15441;
    }

    // 날짜별 그리드
    .fc .fc-daygrid-day-frame {
      padding: 16px;
      height: 60px;
    }

    // 날짜  ex) 2일
    .fc .fc-daygrid-day-top {
      flex-direction: row;
      margin-bottom: 2px;
      font-size: 16px;
    }
    // 각 이벤트 요소
    .fc-event {
      cursor: pointer;
      padding: 3px 5px;
      margin-bottom: 5px;
      border-radius: 4px;
      font-weight: 500;
      font-size: 13px;
      overflow: scroll;
    }
  }
`
const date = new Date()
const initialYear = date.getFullYear()
const initialMonth = date.getMonth() + 1

export const Calendar = () => {
  const [events, setEvents] = useState([])
  //캘린더 이전/다음달 변경시 년/월 정보
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const calendarRef = useRef({})

  const regex = /[^0-9]/g

  useEffect(() => {
    /**날짜별 소비 달력 표시 함수*/
    const renderDailyExpenses = async () => {
      let expenses = await getMonthlyExpenses(year, month, 'team9')

      Object.values(expenses).map(i =>
        i.map(v => {
          setEvents(prevEvents => [
            ...prevEvents,
            {
              title: v.category,
              date: v.date
            }
          ])
        })
      )
    }
    renderDailyExpenses()
  }, [year, month])
  return (
    <>
      <Header />
      <Wrapper>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          headerToolbar={{
            start: 'prevBtn',
            center: 'title',
            end: 'nextBtn'
          }}
          weekends={true}
          locale="ko"
          events={events}
          customButtons={{
            prevBtn: {
              text: '<',
              click: () => {
                calendarRef.current.getApi().prev()
                const calendarMonth = _.get(
                  calendarRef.current.getApi(), //DOM의 정보 가져옴
                  'currentDataManager.data.viewTitle' //보여지는 달에 대한 정보
                )
                setYear(
                  parseInt(
                    calendarMonth.split(' ').map(i => i.replace(regex, ''))[0]
                  )
                )
                setMonth(
                  parseInt(
                    calendarMonth.split(' ').map(i => i.replace(regex, ''))[1]
                  )
                )
                setEvents([])
              }
            },
            nextBtn: {
              text: '>',
              click: () => {
                calendarRef.current.getApi().next()
                const calendarMonth = _.get(
                  calendarRef.current.getApi(), //DOM의 정보 가져옴
                  'currentDataManager.data.viewTitle' //보여지는 달에 대한 정보
                )
                setYear(
                  parseInt(
                    calendarMonth.split(' ').map(i => i.replace(regex, ''))[0]
                  )
                )
                setMonth(
                  parseInt(
                    calendarMonth.split(' ').map(i => i.replace(regex, ''))[1]
                  )
                )
                setEvents([])
              }
            }
          }}
          // eventClick={handleEventClick}
          // 모달 [컨텐츠 - 수정,삭제,취소 버튼]
        />
      </Wrapper>
      <Footer />
    </>
  )
}
