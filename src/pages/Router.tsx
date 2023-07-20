import { createBrowserRouter } from 'react-router-dom'
import { App, NotFound, ErrorComponent } from 'components/index'
import { Home, Chart, SubChart, Calender, List, LogAccount } from 'pages/index'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '',
        element: <Home />,
        errorElement: <ErrorComponent />
      },
      {
        path: 'chart',
        element: <Chart />,
        errorElement: <ErrorComponent />
      },
      {
        path: 'subchart',
        element: <SubChart />,
        errorElement: <ErrorComponent />
      },
      {
        path: 'list',
        element: <List />,
        errorElement: <ErrorComponent />
      },
      {
        path: 'calender',
        element: <Calender />,
        errorElement: <ErrorComponent />
      },
      {
        path: 'logaccount',
        element: <LogAccount />,
        errorElement: <ErrorComponent />
      }
    ]
  }
])
