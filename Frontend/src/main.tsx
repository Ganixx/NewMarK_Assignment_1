import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage.tsx'
import ListingDetailPage from './pages/ListingDetailPage.tsx'
import AddListingPage from './pages/AddListingPage.tsx'

const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/listing/:id', element: <ListingDetailPage /> },
  { path: '/add', element: <AddListingPage /> },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
