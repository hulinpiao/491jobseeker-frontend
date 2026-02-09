import { Select } from './ui/Select'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import type { JobFilters, EmploymentType, WorkArrangement } from '@/types/job'

interface FilterPanelProps {
  filters: JobFilters
  onChange: (filters: JobFilters) => void
}

const EMPLOYMENT_TYPES = [
  { value: '', label: '全部类型' },
  { value: 'full_time', label: '全职' },
  { value: 'part_time', label: '兼职' },
  { value: 'contract', label: '合同工' },
  { value: 'casual', label: '临时' },
  { value: 'temporary', label: '短期' },
] as const

const WORK_ARRANGEMENTS = [
  { value: '', label: '全部方式' },
  { value: 'onsite', label: '现场办公' },
  { value: 'hybrid', label: '混合办公' },
  { value: 'remote', label: '远程办公' },
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
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">筛选条件</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            清除
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium">
            工作地点
          </label>
          <Input
            id="location"
            placeholder="输入城市..."
            value={filters.location ?? ''}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="employmentType" className="mb-1 block text-sm font-medium">
            工作类型
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

        <div>
          <label htmlFor="workArrangement" className="mb-1 block text-sm font-medium">
            工作方式
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
