import { Select } from './ui/Select'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import type { JobFilters, EmploymentType, WorkArrangement } from '@/types/job'

interface FilterPanelProps {
  filters: JobFilters
  onChange: (filters: JobFilters) => void
}

const EMPLOYMENT_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'casual', label: 'Casual' },
  { value: 'temporary', label: 'Temporary' },
] as const

const WORK_ARRANGEMENTS = [
  { value: '', label: 'All Arrangements' },
  { value: 'onsite', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' },
] as const

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const updateFilter = (key: keyof JobFilters, value: string | undefined) => {
    onChange({ ...filters, [key]: value || undefined })
  }

  const clearFilters = () => {
    onChange({})
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4" data-testid="filter-panel">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="location" className="mb-1 block text-sm font-medium">
            Location
          </label>
          <Input
            id="location"
            placeholder="Enter city..."
            value={filters.location ?? ''}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label htmlFor="employmentType" className="mb-1 block text-sm font-medium">
            Employment Type
          </label>
          <Select
            id="employmentType"
            value={filters.employmentType ?? ''}
            onChange={(e) => updateFilter('employmentType', e.target.value as EmploymentType | undefined)}
          >
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex-1">
          <label htmlFor="workArrangement" className="mb-1 block text-sm font-medium">
            Work Arrangement
          </label>
          <Select
            id="workArrangement"
            value={filters.workArrangement ?? ''}
            onChange={(e) => updateFilter('workArrangement', e.target.value as WorkArrangement | undefined)}
          >
            {WORK_ARRANGEMENTS.map((arrangement) => (
              <option key={arrangement.value} value={arrangement.value}>
                {arrangement.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}
