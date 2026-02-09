export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: {
    min?: number
    max?: number
    currency?: string
    period?: 'hour' | 'day' | 'month' | 'year'
  }
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  status: 'active' | 'applied' | 'interview' | 'offered' | 'rejected'
  description: string
  requirements: string[]
  postedAt: string
  url?: string
  source: string
}

export interface JobFilters {
  keyword?: string
  location?: string
  type?: Job['type']
  status?: Job['status']
  minSalary?: number
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface JobsResponse {
  jobs: Job[]
  total: number
  page: number
  limit: number
}
