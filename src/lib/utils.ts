import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSalary(job: {
  salary: { min?: number; max?: number; currency?: string; period?: string }
}): string {
  const { min, max, currency = 'CNY', period = 'year' } = job.salary

  if (!min && !max) return '薪资面议'

  const periodLabel = {
    hour: '/时',
    day: '/天',
    month: '/月',
    year: '/年',
  }[period] || ''

  if (min && max) {
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}${periodLabel}`
  }

  if (min) {
    return `${currency} ${min.toLocaleString()}+${periodLabel}`
  }

  if (max) {
    return `${currency} ${max.toLocaleString()}${periodLabel}以下`
  }

  return '薪资面议'
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}月前`
  return `${Math.floor(diffDays / 365)}年前`
}
