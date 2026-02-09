import { Search } from 'lucide-react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  placeholder?: string
}

export function SearchBar({ value, onChange, onSearch, placeholder = 'Search jobs, companies...' }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10"
          data-testid="search-input"
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  )
}
