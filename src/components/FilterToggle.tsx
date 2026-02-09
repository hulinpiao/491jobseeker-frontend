import { Filter } from 'lucide-react'

interface FilterToggleProps {
  show: boolean
  onToggle: () => void
  count?: number
}

export function FilterToggle({ show, onToggle, count = 0 }: FilterToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="md:hidden w-full flex items-center justify-between gap-2 py-3 px-4 bg-card border rounded-lg hover:bg-accent transition-colors"
      aria-expanded={show}
      aria-label="Toggle filters"
      data-testid="filter-toggle"
    >
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters</span>
        {count > 0 && (
          <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
            {count}
          </span>
        )}
      </div>
      <span className="text-sm text-muted-foreground">
        {show ? '▲' : '▼'}
      </span>
    </button>
  )
}
