import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import HomePage from '../pages/HomePage'

describe('HomePage', () => {
  it('renders listings from API', async () => {
    const listings = [
      { id: 1, title: 'A', price: 1000, location: 'X', description: 'desc' },
      { id: 2, title: 'B', price: 2000, location: 'Y', description: 'desc' },
    ]

    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify(listings), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    ) as any

    const router = createMemoryRouter([
      { path: '/', element: <HomePage /> },
    ])

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(screen.getByText('A')).toBeInTheDocument())
    expect(screen.getByText('B')).toBeInTheDocument()
  })
})


