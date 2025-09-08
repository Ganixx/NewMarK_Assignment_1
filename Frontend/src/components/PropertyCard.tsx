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
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
      {image_url && (
        <Link to={`/listing/${id}`}>
          <img
            src={image_url}
            alt={title}
            style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
          />
        </Link>
      )}
      <div style={{ padding: 12 }}>
        <Link to={`/listing/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ margin: 0, marginBottom: 4 }}>{title}</h3>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ color: '#4b5563', fontSize: 14 }}>{location}</div>
          <div style={{ fontWeight: 700 }}>${price}</div>
        </div>
        <p style={{ margin: 0, color: '#374151' }}>{description}</p>
      </div>
    </div>
  )
}


