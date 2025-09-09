type Props = {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        placeholder="Search by location, property type, or keywords..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ 
          width: '100%', 
          padding: '12px 16px 12px 40px', 
          marginTop: 12, 
          marginBottom: 16,
          border: '2px solid #e5e7eb',
          borderRadius: 8,
          fontSize: 16,
          outline: 'none',
          transition: 'border-color 0.2s ease'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#3b82f6'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#e5e7eb'
        }}
        aria-label="search-input"
      />
      <div style={{
        position: 'absolute',
        left: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9ca3af',
        pointerEvents: 'none'
      }}>
        🔍
      </div>
    </div>
  )
}


