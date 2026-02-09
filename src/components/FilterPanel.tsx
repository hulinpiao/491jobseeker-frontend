import { Select } from './ui/Select'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import type { Job, JobFilters } from '@/types/job'

interface FilterPanelProps {
  filters: JobFilters
  onChange: (filters: JobFilters) => void
}

const JOB_TYPES = [
  { value: '', label: '全部类型' },
  { value: 'full-time', label: '全职' },
  { value: 'part-time', label: '兼职' },
  { value: 'contract', label: '合同工' },
  { value: 'internship', label: '实习' },
] as const

const STATUSES = [
  { value: '', label: '全部状态' },
  { value: 'active', label: '待申请' },
  { value: 'applied', label: '已申请' },
  { value: 'interview', label: '面试中' },
  { value: 'offered', label: '已录用' },
  { value: 'rejected', label: '已拒绝' },
] as const

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const updateFilter = (key: keyof JobFilters, value: string | number | undefined) => {
    onChange({ ...filters, [key]: value || undefined })
  }

  const updateTypeFilter = (value: string) => {
    onChange({ ...filters, type: (value || undefined) as Job['type'] | undefined })
  }

  const updateStatusFilter = (value: string) => {
    onChange({ ...filters, status: (value || undefined) as Job['status'] | undefined })
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
          <label htmlFor="type" className="mb-1 block text-sm font-medium">
            工作类型
          </label>
          <Select
            id="type"
            value={filters.type ?? ''}
            onChange={(e) => updateTypeFilter(e.target.value)}
          >
            {JOB_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium">
            申请状态
          </label>
          <Select
            id="status"
            value={filters.status ?? ''}
            onChange={(e) => updateStatusFilter(e.target.value)}
          >
            {STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="minSalary" className="mb-1 block text-sm font-medium">
            最低月薪（元）
          </label>
          <Input
            id="minSalary"
            type="number"
            placeholder="最低薪资..."
            value={filters.minSalary ?? ''}
            onChange={(e) => updateFilter('minSalary', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>
    </div>
  )
}
