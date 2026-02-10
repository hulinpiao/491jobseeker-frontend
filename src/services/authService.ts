/**
 * Authentication Service
 * Single Responsibility: Handle all authentication API calls
 */

import type {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  AuthResponse,
  User,
} from '@/types/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Get stored auth token from localStorage
 */
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token')
}

/**
 * Store auth token in localStorage
 */
function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token)
}

/**
 * Remove auth token from localStorage
 */
function removeAuthToken(): void {
  localStorage.removeItem('auth_token')
}

/**
 * Generic fetch wrapper with auth headers
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAuthToken()
  const url = `${API_BASE_URL}${endpoint}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options?.headers as Record<string, string>) || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }))
    throw new Error(error.message || `API Error: ${response.status}`)
  }

  return response.json() as Promise<T>
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetchApi<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })

  setAuthToken(response.token)
  return response
}

/**
 * Register a new user
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetchApi<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  setAuthToken(response.token)
  return response
}

/**
 * Verify email with code
 */
export async function verifyEmail(data: VerifyEmailRequest): Promise<AuthResponse> {
  const response = await fetchApi<AuthResponse>('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  setAuthToken(response.token)
  return response
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  return fetchApi<User>('/api/auth/me')
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await fetchApi<void>('/api/auth/logout', { method: 'POST' })
  } finally {
    removeAuthToken()
  }
}

/**
 * Update user profile
 */
export async function updateProfile(data: Partial<User>): Promise<User> {
  return fetchApi<User>('/api/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

/**
 * Get stored token (for use in react-query config)
 */
export function getToken(): string | null {
  return getAuthToken()
}
