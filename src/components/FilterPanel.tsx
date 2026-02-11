import { Select } from './ui/Select'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import type { JobFilters } from '@/types/job'

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
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
] as const

const PLATFORMS = [
  { value: '', label: 'All Platforms' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'indeed', label: 'Indeed' },
  { value: 'seek', label: 'Seek' },
] as const

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const updateFilter = (key: keyof JobFilters, value: string | number | undefined) => {
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

      <div className="space-y-4">
        {/* Keyword Search */}
        <div>
          <label htmlFor="q" className="mb-1 block text-sm font-medium">
            Search
          </label>
          <Input
            id="q"
            placeholder="Job title, company, or skills..."
            value={filters.q ?? ''}
            onChange={(e) => updateFilter('q', e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Location */}
          <div className="flex-1">
            <label htmlFor="location" className="mb-1 block text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              placeholder="City or state..."
              value={filters.location ?? ''}
              onChange={(e) => updateFilter('location', e.target.value)}
            />
          </div>

          {/* Platform */}
          <div className="flex-1">
            <label htmlFor="platform" className="mb-1 block text-sm font-medium">
              Platform
            </label>
            <Select
              id="platform"
              value={filters.platform ?? ''}
              onChange={(e) => updateFilter('platform', e.target.value)}
            >
              {PLATFORMS.map((platform) => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Employment Type */}
          <div className="flex-1">
            <label htmlFor="employmentType" className="mb-1 block text-sm font-medium">
              Employment Type
            </label>
            <Select
              id="employmentType"
              value={filters.employmentType ?? ''}
              onChange={(e) => updateFilter('employmentType', e.target.value)}
            >
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Work Arrangement */}
          <div className="flex-1">
            <label htmlFor="workArrangement" className="mb-1 block text-sm font-medium">
              Work Arrangement
            </label>
            <Select
              id="workArrangement"
              value={filters.workArrangement ?? ''}
              onChange={(e) => updateFilter('workArrangement', e.target.value)}
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
    </div>
  )
}
