import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import AddListingPage from '../pages/AddListingPage'

describe('AddListingPage', () => {
  it('submits form and navigates to detail', async () => {
    const user = userEvent.setup()
    const created = { id: 7 }
    global.fetch = vi.fn(async () => new Response(JSON.stringify(created), { status: 201 })) as any

    const router = createMemoryRouter([
      { path: '/add', element: <AddListingPage /> },
      { path: '/listing/:id', element: <div>Detail</div> },
    ], { initialEntries: ['/add'] })

    render(<RouterProvider router={router} />)

    await user.type(screen.getByLabelText('Title', { selector: 'input' }), 'My Listing')
    await user.type(screen.getByLabelText('Price', { selector: 'input' }), '1234')
    await user.type(screen.getByLabelText('Location', { selector: 'input' }), 'City')
    await user.type(screen.getByLabelText('Description', { selector: 'textarea' }), 'Nice place')

    await user.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/listing/7'))
  })
})


