import { Link } from 'react-router-dom'

type Props = {
  id: number
  title: string
  price: number
  location: string
  description: string
  image_url?: string
}

export default function PropertyCard({ id, title, price, location, description, image_url }: Props) {
  return (
    <div style={{ 
      border: '1px solid #e5e7eb', 
      borderRadius: 12, 
      overflow: 'hidden', 
      background: '#fff',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
      e.currentTarget.style.transform = 'translateY(0)'
    }}>
      {image_url && (
        <Link to={`/listing/${id}`}>
          <img
            src={image_url}
            alt={title}
            style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
          />
        </Link>
      )}
      <div style={{ padding: 16 }}>
        <Link to={`/listing/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ margin: 0, marginBottom: 8, fontSize: 16, fontWeight: 600 }}>{title}</h3>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div style={{ color: '#6b7280', fontSize: 14 }}>{location}</div>
          <div style={{ fontWeight: 700, color: '#059669', fontSize: 16 }}>${price.toLocaleString()}</div>
        </div>
        <p style={{ margin: 0, color: '#374151', fontSize: 14, lineHeight: 1.4 }}>{description}</p>
      </div>
    </div>
  )
}


