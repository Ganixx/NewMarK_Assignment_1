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
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
          marginTop: 20,
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
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 24,
        backgroundColor: 'white',
        padding: '20px 24px',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#111827' }}>🏠 PropertyListings</h1>
        <Link 
          to="/add" 
          style={{ 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: 8, 
            textDecoration: 'none',
            fontWeight: 600,
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6'
          }}
        >
          + Add Listing
        </Link>
      </header>
      <div style={{ maxWidth: 640, margin: '0 auto 24px' }}>
        <SearchBar value={query} onChange={onChange} />
      </div>
      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#6b7280',
          fontSize: 18
        }}>
          🔄 Loading properties...
        </div>
      )}
      {error && (
        <div 
          role="alert" 
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '16px',
            borderRadius: 8,
            marginBottom: 20,
            textAlign: 'center'
          }}
        >
          ❌ {error}
        </div>
      )}
      {!loading && !error && listings.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏡</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: 20, color: '#374151' }}>No properties found</h3>
          <p style={{ margin: 0, color: '#6b7280' }}>
            {query ? 'Try adjusting your search terms.' : 'No properties are available at the moment.'}
          </p>
        </div>
      )}
      {rendered}
    </main>
  )
}


