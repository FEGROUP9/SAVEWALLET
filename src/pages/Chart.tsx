import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header, Footer } from 'src/components'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js'
import { Pie } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { pieOptions } from 'components/chart/PieChartOptions'
import { ChevronRightIcon } from '@heroicons/react/outline'
import { fetchExpenses } from 'api/FetchCategoryExpenses'
import { useRecoilState } from 'recoil'
import { selectedDateState } from 'recoil/SelectedDateState'
import { useChartHandlers } from 'src/hooks/ChartHooks'
import { PeriodRange } from 'components/chart/PeriodRange'
import styled from 'styled-components'

// Chart.js, react-chartjs-2
// register() 메서드를 사용해 사용자 정의 요소들을 등록한 후,
// react-chartjs-2 컴포넌트를 통해 차트에 사용할 수 있음
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

// Styled-components 스타일링
const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0 auto;
  width: 100%;
  background-color: blanchedalmond;

  /* @media ${props => props.theme.mobile} {
  }

  @media ${props => props.theme.tablet} {
  }

  @media ${props => props.theme.laptop} {
  }

  @media ${props => props.theme.desktop} {
  } */
`

const ChartTitle = styled.h2`
  display: inline-block;
  margin: 30px 0;
  font-weight: 700;
  font-size: 26px;
`

const IncomeExpensesFilter = styled.form`
  display: flex;
  justify-content: center;
  margin: 30px 0;
`

const IncomesOptions = styled.span`
  margin-right: 20px;
  font-size: 20px;
`

const ExpensesOptions = styled.span`
  font-size: 20px;
`

const ChartContainer = styled.figure`
  margin-bottom: 30px;
`

const ChartList = styled.section`
  display: flex;
  flex-direction: column;
`
const ListTotalExpenses = styled.h3`
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  padding: 10px;
  border: 2px solid #000;
  font-size: 20px;
`

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #000;
  font-size: 20px;

  h3 {
    flex: 1;
    position: relative;
    left: 20px;
  }

  p {
    margin-right: 20px;
  }
`

const NavIcon = styled(ChevronRightIcon)`
  width: 30px;
`

// Chart Page Component
export const Chart = () => {
  const navigate = useNavigate()
  const [chartData, setChartData] = useState<ChartData<'pie'> | null>(null)

  // 월별 Filtering - RecoilState
  const [selectedDate] = useRecoilState(selectedDateState)

  // 수입, 지출 Filtering
  const [chartFilter, setChartFilter] = useState<'income' | 'expenses'>(
    'expenses'
  )

  // 차트 하단에 출력될 카테고리별 수입, 지출 내역
  const [categoryList, setCategoryList] = useState<{
    [category: string]: number
  }>({})

  // 수입, 지출 총액 계산
  const totalAmount = Object.values(categoryList)
    .filter(amount => amount > 0)
    .reduce((sum, amount) => sum + amount, 0)

  // ChartHandlers - 월별 Filtering, 총합 가격 순으로 정렬, SubChart 렌더링
  const {
    handlePrevMonth,
    handleNextMonth,
    sortByAmount,
    // handleCategoryClick,
    handleShowSubChart
  } = useChartHandlers()

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // 모든 수입, 지출 데이터 가져오기
        const expensesData = await fetchExpenses()
        console.log(expensesData)

        // 수입, 지출 데이터 Filtering - input button
        const filteredData = expensesData.filter(
          item =>
            (chartFilter === 'income' ? item.amount >= 0 : item.amount < 0) &&
            new Date(item.date).getMonth() + 1 === selectedDate.month
        )
        console.log(filteredData)

        if (filteredData === null || filteredData.length === 0) {
          const confirmMessage = `${selectedDate.year}년 ${selectedDate.month}월의 데이터가 없습니다.\n수입 및 지출 내역을 입력해주세요!
          \n확인 버튼 클릭 시 입력 페이지로 이동합니다!`

          if (window.confirm(confirmMessage)) {
            navigate('/logaccount')
          }
          return
        }

        // category별로 데이터 집계
        const aggregatedData = {}
        filteredData.forEach(item => {
          const categoryName = item.category
          const amount = Math.abs(item.amount)

          if (aggregatedData[categoryName]) {
            aggregatedData[categoryName] += amount
          } else {
            aggregatedData[categoryName] = amount
          }
        })

        // category 속성 중 메인 카테고리만 추출하여 다시 데이터 집계
        const mainCategories = Object.keys(aggregatedData).map(
          category => category.split('.')[0]
        )

        const aggregatedMainCategories = mainCategories.reduce(
          (acc, category) => {
            const amount = aggregatedData[category] || 0
            acc[category] = (acc[category] || 0) + amount
            return acc
          },
          {}
        )

        // Chart Data 내용 - Pie Chart
        const data: ChartData<'pie'> = {
          // 메인 카테고리를 라벨로 출력
          labels: Object.keys(aggregatedMainCategories),
          datasets: [
            {
              data: Object.values(aggregatedMainCategories),
              // 메인 카테고리 데이터 중복 없이 차트 출력
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
        setCategoryList(aggregatedMainCategories)
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
        <ChartTitle>카테고리별 수입·지출</ChartTitle>
        <PeriodRange
          selectedDate={selectedDate}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
        />
        <IncomeExpensesFilter>
          <IncomesOptions>
            <input
              type="radio"
              id="income"
              name="filter"
              value="income"
              checked={chartFilter === 'income'}
              onChange={() => setChartFilter('income')}
            />
            <label htmlFor="income">수입</label>
          </IncomesOptions>
          <ExpensesOptions>
            <input
              type="radio"
              id="expenses"
              name="filter"
              value="expenses"
              checked={chartFilter === 'expenses'}
              onChange={() => setChartFilter('expenses')}
            />
            <label htmlFor="expenses">지출</label>
          </ExpensesOptions>
        </IncomeExpensesFilter>
        <ChartContainer style={{ width: '100%', height: '600px' }}>
          {chartData && (
            <Pie
              data={chartData}
              options={pieOptions}
            />
          )}
        </ChartContainer>
        <ChartList>
          <ul>
            {chartFilter === 'income' && (
              <ListTotalExpenses>
                <p>전체</p>
                <span>{totalAmount.toLocaleString()}원</span>
              </ListTotalExpenses>
            )}
            {chartFilter === 'expenses' && (
              <ListTotalExpenses>
                <p>전체</p>
                <span>{totalAmount.toLocaleString()}원</span>
              </ListTotalExpenses>
            )}
            {Object.entries(categoryList)
              .sort(sortByAmount)
              .map(([category, amount]) => (
                <ListItem key={category}>
                  <h3>{category}</h3>
                  <p>{amount.toLocaleString()}원</p>
                  <NavIcon onClick={() => handleShowSubChart(category)} />
                </ListItem>
              ))}
          </ul>
        </ChartList>
      </Wrapper>
      <Footer />
    </>
  )
}
