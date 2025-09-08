import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import ListingDetailPage from '../pages/ListingDetailPage'

describe('ListingDetailPage', () => {
  it('loads a listing and shows summary bullets', async () => {
    const listing = { id: 42, title: 'Test Home', price: 1234, location: 'Loc', description: 'A. B. C.' }

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(listing), { status: 200 })) // GET listing
      .mockResolvedValueOnce(new Response(JSON.stringify({ bullets: ['- A', '- B', '- C'] }), { status: 200 })) // POST summary
    global.fetch = fetchMock as any

    const router = createMemoryRouter([
      { path: '/listing/:id', element: <ListingDetailPage /> },
    ], { initialEntries: ['/listing/42'] })

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(screen.getByText('Test Home')).toBeInTheDocument())

    const btn = screen.getByRole('button', { name: /get summary/i })
    btn.click()
    await waitFor(() => expect(screen.getByText('- A')).toBeInTheDocument())
    expect(screen.getByText('- B')).toBeInTheDocument()
    expect(screen.getByText('- C')).toBeInTheDocument()
  })
})


