/**
 * Resume API Service
 * Single Responsibility: Handle all resume-related API communication
 */

import type {
  AnalysisResult,
  ResumeMetadata,
  UploadResult,
} from '@/types/resume'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  return localStorage.getItem('token')
}

/**
 * Generic fetch wrapper with error handling and auth
 */
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`
  const token = getAuthToken()

  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error?.message || `API Error: ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()
  return data.data
}

/**
 * Upload resume file
 */
export async function uploadResume(file: File): Promise<UploadResult> {
  const formData = new FormData()
  formData.append('file', file)

  const url = `${API_BASE}/api/resume/upload`
  const token = getAuthToken()

  const response = await fetch(url, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error?.message || `Upload failed: ${response.status}`
    )
  }

  const data = await response.json()
  return data.data
}

/**
 * Get resume metadata by ID
 */
export async function getResume(resumeId: string): Promise<ResumeMetadata> {
  return fetchApi<ResumeMetadata>(`/api/resume/${resumeId}`)
}

/**
 * Trigger AI analysis for a resume
 */
export async function analyzeResume(resumeId: string): Promise<AnalysisResult> {
  return fetchApi<AnalysisResult>(`/api/resume/analyze/${resumeId}`, {
    method: 'POST',
  })
}

/**
 * Delete a resume
 */
export async function deleteResume(resumeId: string): Promise<void> {
  await fetchApi<void>(`/api/resume/${resumeId}`, {
    method: 'DELETE',
  })
}

/**
 * Resume API object for convenient imports
 */
export const resumeApi = {
  uploadResume,
  getResume,
  analyzeResume,
  deleteResume,
}
