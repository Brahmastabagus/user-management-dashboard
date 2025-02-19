import { createBrowserRouter, RouterProvider } from 'react-router'
import './App.css'
import ErrorPage from './pages/Error'
import { lazy } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const Dashboard = lazy(() => import('./components/Dashboard'))
const Home = lazy(() => import('./pages/Home'))
const Form = lazy(() => import('./pages/AddUpdate'))

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Dashboard />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/add-user',
          element: <Form />
        },
        {
          path: '/edit-user/:id',
          element: <Form />
        }
      ]
    }
  ])

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  )
}

export default App
