export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  visaType?: string
  visaExpiry?: string
  linkedInUrl?: string
  location?: string
}

export interface VerifyEmailRequest {
  email: string
  code: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  visaType?: string
  visaExpiry?: string
  linkedInUrl?: string
  location?: string
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}
