import { useState, useEffect } from 'react'
import { Footer, Header } from 'src/components'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js'
import { Pie } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { fetchExpenses } from 'src/api/FetchCategoryExpenses'
import { useRecoilState } from 'recoil'
import { selectedDateState } from 'src/recoil/SelectedDateState'
import styled from 'styled-components'

// Chart.js, react-chartjs-2
// register() 메서드를 사용해 사용자 정의 요소들을 등록한 후,
// react-chartjs-2 컴포넌트를 통해 차트에 사용할 수 있음
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

// Chart Data 속성 지정
const options: ChartOptions<'pie'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      labels: {
        usePointStyle: true,
        pointStyle: 'line',
        boxWidth: 13
      },
      position: 'right'
    },
    datalabels: {
      display: true,
      color: '#000',
      formatter: function (value: any, context: any) {
        const label = context.chart.data.labels[context.dataIndex]
        // const formattedVal = Intl.NumberFormat('en-US', {
        //   minimumFractionDigits: 2
        // }).format(value)

        return `${label}`
      }
    }
  }
}

// Styled-components 스타일링
const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 770px;
  height: 1000px;

  /* @media ${props => props.theme.mobile} {
  }

  @media ${props => props.theme.tablet} {
  }

  @media ${props => props.theme.laptop} {
  }

  @media ${props => props.theme.desktop} {
  } */

  h1 {
    font-size: 30px;
    margin-bottom: 40px;
  }

  p {
    font-size: 25px;
  }
`

const SelectedRange = styled.div`
  display: flex;
  justify-content: space-evenly;
`

const StyledChevronLeftIcon = styled(ChevronLeftIcon)`
  width: 40px;
`

const StyledChevronRightIcon = styled(ChevronRightIcon)`
  width: 40px;
`

// Chart Page Component
export const Chart = () => {
  const [chartData, setChartData] = useState<ChartData<'pie'> | null>(null)

  // 월별 Filtering - RecoilState
  const [selectedDate, setSelectedDate] = useRecoilState(selectedDateState)

  // 수입, 지출 Filtering
  const [chartFilter, setChartFilter] = useState<'income' | 'expenses'>(
    'expenses'
  )

  // 차트 하단에 출력될 카테고리별 수입, 지출 내역
  const [categoryList, setCategoryList] = useState<
    { id: string; category: string; amount: number }[]
  >([])

  // 월별 Filtering - onClick Event Functions
  const handlePrevMonth = () => {
    const currentYear = selectedDate.year
    const currentMonth = selectedDate.month

    if (currentMonth === 1) {
      setSelectedDate({ year: currentYear - 1, month: 12 })
    } else {
      setSelectedDate({ year: currentYear, month: currentMonth - 1 })
    }
  }

  const handleNextMonth = () => {
    const currentYear = selectedDate.year
    const currentMonth = selectedDate.month

    if (currentMonth === 12) {
      setSelectedDate({ year: currentYear + 1, month: 1 })
    } else {
      setSelectedDate({ year: currentYear, month: currentMonth + 1 })
    }
  }

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const expensesData = await fetchExpenses()
        console.log(expensesData)

        const filteredData = expensesData.filter(
          item =>
            (chartFilter === 'income' ? item.amount >= 0 : item.amount < 0) &&
            new Date(item.date).getMonth() + 1 === selectedDate.month
        )
        console.log(filteredData)

        const data: ChartData<'pie'> = {
          labels: filteredData.map(item => item.category),
          datasets: [
            {
              label: '# of Votes',
              data: filteredData.map(item => Math.abs(item.amount)),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }
          ]
        }
        setChartData(data)
        setCategoryList(
          filteredData.map(item => ({
            id: item._id || item.id,
            category: item.category,
            amount: Math.abs(item.amount)
            // 수입, 지출에 관계 없이 Chart에서는 모두 양수(절댓값)로 출력
          }))
        )
      } catch (error) {
        console.log(error)
      }
    }

    fetchChartData()
  }, [chartFilter, selectedDate])
  console.log(categoryList)

  return (
    <>
      <Header />
      <Wrapper>
        <h1>카테고리별 수입/지출</h1>
        <SelectedRange>
          <StyledChevronLeftIcon onClick={handlePrevMonth} />
          <p>
            {selectedDate.year}년 {selectedDate.month}월
          </p>
          <StyledChevronRightIcon onClick={handleNextMonth} />
        </SelectedRange>
        <div>
          <input
            type="radio"
            id="income"
            name="filter"
            value="income"
            checked={chartFilter === 'income'}
            onChange={() => setChartFilter('income')}
          />
          <label htmlFor="income">수입</label>
        </div>
        <div>
          <input
            type="radio"
            id="expenses"
            name="filter"
            value="expenses"
            checked={chartFilter === 'expenses'}
            onChange={() => setChartFilter('expenses')}
          />
          <label htmlFor="expenses">지출</label>
        </div>
        {chartData && (
          <Pie
            data={chartData}
            options={options}
          />
        )}
        <ul>
          {categoryList.map(item => (
            <li key={item.id}>
              <span>{item.category}</span>
              <span>{item.amount}</span>
            </li>
          ))}
        </ul>
      </Wrapper>
      <Footer />
    </>
  )
}
