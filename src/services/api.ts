/**
 * API Service for job data
 * Single Responsibility: Handle all API communication
 */

import type { ApiJob, ApiJobsResponse } from '@/types/job'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

/**
 * Fetch jobs with pagination and filters
 */
export async function fetchJobs(params: {
  page?: number
  limit?: number
  keyword?: string
  location?: string
  employmentType?: string
  workArrangement?: string
}): Promise<ApiJobsResponse> {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.append('page', params.page.toString())
  if (params.limit) searchParams.append('limit', params.limit.toString())
  if (params.keyword) searchParams.append('q', params.keyword) // Backend uses 'q'
  if (params.location) searchParams.append('location', params.location)
  if (params.employmentType) searchParams.append('employment_type', params.employmentType) // Backend uses snake_case
  if (params.workArrangement) searchParams.append('work_arrangement', params.workArrangement) // Backend uses snake_case

  const queryString = searchParams.toString()
  const endpoint = `/api/jobs${queryString ? `?${queryString}` : ''}`

  return fetchApi<ApiJobsResponse>(endpoint)
}

/**
 * Fetch a single job by ID
 * Note: Backend returns the job object directly, not wrapped in { data: ... }
 */
export async function fetchJobById(id: string): Promise<ApiJob> {
  return fetchApi<ApiJob>(`/api/jobs/${id}`)
}
