import { useState, useEffect } from 'react'
import { Header, Footer } from 'src/components'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { fetchExpenses } from 'src/api/FetchCategoryExpenses'
import { useRecoilValue } from 'recoil'
import { selectedCategoryState } from 'recoil/SelectedCategoryState'
import styled from 'styled-components'

// Chart.js, react-chartjs-2
// register() 메서드를 사용해 사용자 정의 요소들을 등록한 후,
// react-chartjs-2 컴포넌트를 통해 차트에 사용할 수 있음
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Chart labels - Vertical Bar Chart
const labels = ['3월', '4월', '5월', '6월', '7월']

// Chart Data 속성 지정 - Vertical Bar Chart
const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        pointStyle: 'rectRounded',
        boxWidth: 15,
        font: {
          size: 15
        }
      }
    },
    title: {
      display: true,
      text: '월별 수입 및 지출',
      color: '#000',
      font: {
        size: 25
      }
    }
  }
}

// styled-components 스타일링
const Wrapper = styled.main`
  margin: 0 auto;
  width: 100%;
  height: 600px;
  background-color: beige;
`

const ChartContainer = styled.figure`
  margin-bottom: 30px;
`

const ChartList = styled.section``

const ListItem = styled.li`
  display: flex;
  justify-content: space-around;
`

// SubChart Page Component
export const SubChart = () => {
  const [subChartData, setSubChartData] = useState<ChartData<
    'bar',
    (number | [number, number] | null)[]
  > | null>(null)

  const selectedCategory = useRecoilValue(selectedCategoryState)
  const [categoryExpenses, setCategoryExpenses] = useState<any[]>([])

  const splitCategory = category => {
    const [primary, secondary] = category.split('.')
    return { primary, secondary: secondary || '' }
  }

  useEffect(() => {
    const fetchSubChartData = async () => {
      try {
        const expensesData = await fetchExpenses()

        const transformedExpensesData = expensesData.map(item => {
          const { amount, category, date } = item
          const { primary, secondary } = splitCategory(category)

          return {
            amount,
            category: primary,
            subCategory: secondary,
            date
          }
        })

        const groupedData: {
          [key: string]: { income: number; expense: number }
        } = {}

        transformedExpensesData.forEach(item => {
          const month = new Date(item.date).getMonth()
          const amount = Math.abs(item.amount)

          if (!groupedData[month]) {
            groupedData[month] = {
              income: item.amount >= 0 ? amount : 0,
              expense: item.amount < 0 ? amount : 0
            }
          } else {
            if (item.amount >= 0) {
              groupedData[month].income += amount
            } else {
              groupedData[month].expense += amount
            }
          }
        })

        const filteredCategory = transformedExpensesData.filter(item => {
          const { primary } = splitCategory(item.category)
          if (
            selectedCategory === item.category ||
            selectedCategory === primary
          ) {
            return true
          }
          return false
        })
        console.log('selected category는?:', selectedCategory)
        console.log('filtered category는?:', filteredCategory)

        // const incomes = transformedExpensesData.filter(item => item.amount >= 0)
        // const expenses = transformedExpensesData.filter(item => item.amount < 0)

        const data: ChartData<'bar'> = {
          labels: labels,
          datasets: [
            {
              label: '수입',
              data: labels.map(
                (_, index) => groupedData[index + 2]?.income || 0
              ),
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: '지출',
              data: labels.map(
                (_, index) => groupedData[index + 2]?.expense || 0
              ),
              backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }
          ]
        }

        setCategoryExpenses(filteredCategory)
        setSubChartData(data)
        console.log(expensesData)
        console.log(categoryExpenses)
      } catch (error) {
        console.log(error)
      }
    }
    fetchSubChartData()
  }, [selectedCategory])

  return (
    <>
      <Header />
      <Wrapper>
        <ChartContainer style={{ width: '100%', height: '600px' }}>
          {subChartData && (
            <Bar
              options={{
                ...options,
                plugins: {
                  ...options.plugins,
                  datalabels: {
                    display: true,
                    align: 'end',
                    anchor: 'end',
                    color: '#000',
                    font: {
                      size: 15
                    },
                    formatter: value => {
                      if (value === 0 || value === null) {
                        return ''
                      }
                      return `${value.toLocaleString()}원`
                    }
                  }
                }
              }}
              data={subChartData}
              plugins={[ChartDataLabels]}
            />
          )}
        </ChartContainer>
        <ChartList>
          <ul>
            {categoryExpenses.map(expense => (
              <ListItem key={expense.date}>
                <h3>{expense.date.split('T')[0]}</h3>
                <p>{expense.category}</p>
                <p>{expense.subCategory}서브 카테고리 부분</p>
                <p>{expense.amount.toLocaleString()}원</p>
              </ListItem>
            ))}
          </ul>
        </ChartList>
      </Wrapper>
      <Footer />
    </>
  )
}
