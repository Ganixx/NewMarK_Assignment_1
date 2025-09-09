import { Link, useNavigate } from 'react-router-dom'
import ListingForm, { type ListingFormValues } from '../components/ListingForm'

export default function AddListingPage() {
  const navigate = useNavigate()
  const apiBase = 'https://newmark-assignment-1.onrender.com'

  const onSubmit = async (values: ListingFormValues) => {
    const res = await fetch(`${apiBase}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...values,
        price: Number(values.price),
        image_url: values.image_url || null,
      }),
    })
    if (res.ok) {
      const created = await res.json()
      navigate(`/listing/${created.id}`)
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Link to="/">← Back</Link>
      <h1>Add Listing</h1>
      <ListingForm onSubmit={onSubmit} />
    </main>
  )
}


