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
 * Backend API response wrapper
 */
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown[]
  }
}

/**
 * Login response from backend
 */
interface LoginResponseData {
  user: User
  token: string
}

/**
 * Register response from backend (no token)
 */
interface RegisterResponseData {
  user: User
  message: string
}

/**
 * Verify email response from backend (no token yet)
 */
interface VerifyEmailResponseData {
  user: User
  message: string
}

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
    const errorMessage = error.error?.message || error.message || `API Error: ${response.status}`
    throw new Error(errorMessage)
  }

  return response.json() as Promise<T>
}

/**
 * Login with email and password
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetchApi<ApiResponse<LoginResponseData>>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Login failed')
  }

  setAuthToken(response.data.token)
  return {
    user: response.data.user,
    token: response.data.token,
  }
}

/**
 * Register a new user
 * Note: Registration does not return a token (email verification required first)
 */
export async function register(data: RegisterRequest): Promise<{ user: User }> {
  // Only send email and password to backend (other fields are optional)
  const response = await fetchApi<ApiResponse<RegisterResponseData>>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  })

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Registration failed')
  }

  // Store email for verification step
  localStorage.setItem('pending_verification_email', data.email)

  return { user: response.data.user }
}

/**
 * Verify email with code
 * Note: Still no token - need to login after verification
 */
export async function verifyEmail(data: VerifyEmailRequest): Promise<{ user: User }> {
  const response = await fetchApi<ApiResponse<VerifyEmailResponseData>>('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Verification failed')
  }

  return { user: response.data.user }
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  const response = await fetchApi<ApiResponse<{ user: User }>>('/api/auth/me')

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to get user')
  }

  return response.data.user
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  try {
    await fetchApi<ApiResponse<void>>('/api/auth/logout', { method: 'POST' })
  } finally {
    removeAuthToken()
    localStorage.removeItem('pending_verification_email')
  }
}

/**
 * Update user profile
 */
export async function updateProfile(data: Partial<User>): Promise<User> {
  const response = await fetchApi<ApiResponse<{ user: User }>>('/api/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  if (!response.success || !response.data) {
    throw new Error(response.error?.message || 'Failed to update profile')
  }

  return response.data.user
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

/**
 * Get pending verification email (stored during registration)
 */
export function getPendingEmail(): string | null {
  return localStorage.getItem('pending_verification_email')
}

/**
 * Clear pending verification email
 */
export function clearPendingEmail(): void {
  localStorage.removeItem('pending_verification_email')
}
