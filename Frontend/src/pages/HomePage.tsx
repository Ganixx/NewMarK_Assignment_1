import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import PropertyCard from '../components/PropertyCard'

type Listing = {
  id: number
  title: string
  price: number
  location: string
  description: string
  image_url?: string | null
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || '/api'

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const url = query ? `/listings?q=${encodeURIComponent(query)}` : '/listings'
        const res = await fetch(`${apiBase}${url}`)
        if (!res.ok) throw new Error('Failed to fetch listings')
        const data = (await res.json()) as Listing[]
        if (!cancelled) setListings(data)
      } catch (e: any) {
        if (!cancelled) setError(e.message ?? 'Error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [query])

  const onChange = (value: string) => setQuery(value)

  const rendered = useMemo(
    () => (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 16,
          marginTop: 16,
        }}
      >
        {listings.map((l) => (
          <PropertyCard
            key={l.id}
            id={l.id}
            title={l.title}
            price={l.price}
            location={l.location}
            description={l.description}
            image_url={l.image_url ?? undefined}
          />
        ))}
      </div>
    ),
    [listings],
  )

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h1 style={{ margin: 0 }}>Properties</h1>
        <Link to="/add">Add Listing</Link>
      </header>
      <div style={{ maxWidth: 640, margin: '16px auto 8px' }}>
        <SearchBar value={query} onChange={onChange} />
      </div>
      {loading && <div>Loading...</div>}
      {error && <div role="alert">{error}</div>}
      {rendered}
    </main>
  )
}


