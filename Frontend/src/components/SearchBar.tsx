type Props = {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <input
      placeholder="Search by keyword..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', padding: 8, marginTop: 12, marginBottom: 16 }}
      aria-label="search-input"
    />
  )
}


