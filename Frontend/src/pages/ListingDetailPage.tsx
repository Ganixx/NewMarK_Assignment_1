import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

type Listing = {
  id: number
  title: string
  price: number
  location: string
  description: string
  image_url?: string | null
}

export default function ListingDetailPage() {
  const { id } = useParams()
  const [listing, setListing] = useState<Listing | null>(null)
  const [bullets, setBullets] = useState<string[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || '/api'

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setError(null)
        const res = await fetch(`${apiBase}/listings/${id}`)
        if (!res.ok) throw new Error('Failed to fetch listing')
        const data = (await res.json()) as Listing
        if (!cancelled) setListing(data)
      } catch (e: any) {
        if (!cancelled) setError(e.message ?? 'Error')
      }
    }
    if (id) load()
    return () => {
      cancelled = true
    }
  }, [id])

  const summarize = async () => {
    if (!id) return
    const res = await fetch(`${apiBase}/listings/${id}/summary`, {
      method: 'POST',
    })
    if (!res.ok) return
    const data = (await res.json()) as { bullets: string[] }
    setBullets(data.bullets)
  }

  if (error) return <div role="alert">{error}</div>
  if (!listing) return <div>Loading...</div>

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <Link to="/">← Back</Link>
      {listing.image_url && (
        <div style={{ marginTop: 12, marginBottom: 16 }}>
          <img
            src={listing.image_url}
            alt={listing.title}
            style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 12 }}
          />
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <h1 style={{ margin: 0 }}>{listing.title}</h1>
        <div style={{ fontSize: 24, fontWeight: 700 }}>${listing.price}</div>
      </div>
      <section style={{ marginTop: 16 }}>
        <h3 style={{ margin: '12px 0 4px' }}>Location</h3>
        <div style={{ color: '#4b5563' }}>{listing.location}</div>
      </section>
      <section style={{ marginTop: 16 }}>
        <h3 style={{ margin: '12px 0 4px' }}>Description</h3>
        <p style={{ marginTop: 4 }}>{listing.description}</p>
      </section>
      <section style={{ marginTop: 16 }}>
        <button onClick={summarize} style={{ padding: '8px 12px' }}>
          Get Summary
        </button>
        {bullets && (
          <ul>
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}


