import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Login from './pages/login.jsx'
import Register from './pages/register.jsx'
import Forgot from './pages/forgotpassword.jsx'
import Home from './pages/home.jsx'
import Liked from './pages/liked.jsx'

const router = createBrowserRouter([
  {path: '/', element: <Login/>},
  {path: '/register', element: <Register/>},
  {path: '/forgotpassword', element: <Forgot/>},
  {path: '/home', element: <Home/>},
  {path: '/liked', element: <Liked/>},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
