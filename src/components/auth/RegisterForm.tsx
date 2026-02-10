/**
 * RegisterForm Component
 * Single Responsibility: Handle multi-step user registration
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

// Step 1: Email and password
const step1Schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// Step 1.5: Email verification
const step1dot5Schema = z.object({
  email: z.string().email(),
  verificationCode: z.string().min(1, 'Verification code is required').length(6, 'Code must be 6 digits'),
})

// Step 2: Profile information
const step2Schema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  visaType: z.string().optional(),
  visaExpiry: z.string().optional(),
  linkedInUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  location: z.string().optional(),
})

type Step1Values = z.infer<typeof step1Schema>
type Step1dot5Values = z.infer<typeof step1dot5Schema>
type Step2Values = z.infer<typeof step2Schema>

const VISA_TYPES = [
  { value: '', label: 'Select your visa type' },
  { value: '491', label: 'Skilled Work Regional (Provisional) (491)' },
  { value: '494', label: 'Skilled Employer Sponsored Regional (Provisional) (494)' },
  { value: '482', label: 'Temporary Skill Shortage (482)' },
  { value: '186', label: 'Employer Nomination Scheme (186)' },
  { value: 'other', label: 'Other' },
]

interface RegisterFormProps {
  onSuccess?: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const navigate = useNavigate()
  const { register, verifyEmail, isRegistering, isVerifyingEmail, error } = useAuth()

  const [step, setStep] = useState<1 | 1.5 | 2>(1)
  const [email, setEmail] = useState('')

  // Step 1 form
  const step1Form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  })

  // Step 1.5 form
  const step1dot5Form = useForm<Step1dot5Values>({
    resolver: zodResolver(step1dot5Schema),
    defaultValues: { email, verificationCode: '' },
  })

  // Step 2 form
  const step2Form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      visaType: '',
      visaExpiry: '',
      linkedInUrl: '',
      location: '',
    },
  })

  // Handle Step 1 submit - initiate registration
  const handleStep1Submit = async (values: Step1Values) => {
    try {
      // Store email for next steps
      setEmail(values.email)
      step1dot5Form.setValue('email', values.email)

      // Call register API (this should send verification code)
      await register({
        email: values.email,
        password: values.password,
        firstName: '',
        lastName: '',
      })

      setStep(1.5)
    } catch {
      // Error is handled by useAuth hook
    }
  }

  // Handle Step 1.5 submit - verify email code
  const handleStep1dot5Submit = async (data: Step1dot5Values) => {
    try {
      await verifyEmail({ email: data.email, code: data.verificationCode })
      setStep(2)
    } catch {
      // Error is handled by useAuth hook
    }
  }

  // Handle Step 2 submit - complete profile
  const handleStep2Submit = async () => {
    try {
      // Navigate to profile page
      onSuccess?.()
      navigate('/profile')
    } catch {
      // Error is handled by useAuth hook
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-2">
        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 1.5 ? 'bg-primary' : 'bg-muted'}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
          {error.message || 'Registration failed. Please try again.'}
        </div>
      )}

      {/* Step 1: Email and Password */}
      {step === 1 && (
        <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Create your account</h3>
            <p className="text-sm text-muted-foreground">
              Enter your email address and create a password
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...step1Form.register('email')}
              aria-invalid={!!step1Form.formState.errors.email}
            />
            {step1Form.formState.errors.email && (
              <p className="text-sm text-destructive">{step1Form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...step1Form.register('password')}
              aria-invalid={!!step1Form.formState.errors.password}
            />
            {step1Form.formState.errors.password && (
              <p className="text-sm text-destructive">{step1Form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...step1Form.register('confirmPassword')}
              aria-invalid={!!step1Form.formState.errors.confirmPassword}
            />
            {step1Form.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">{step1Form.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isRegistering}>
            {isRegistering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending code...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      )}

      {/* Step 1.5: Email Verification */}
      {step === 1.5 && (
        <form onSubmit={step1dot5Form.handleSubmit(handleStep1dot5Submit)} className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Verify your email</h3>
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit code to <span className="font-medium">{email}</span>
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="verificationCode" className="text-sm font-medium text-foreground">
              Verification Code
            </label>
            <Input
              id="verificationCode"
              type="text"
              placeholder="123456"
              maxLength={6}
              className="text-center text-lg tracking-widest"
              {...step1dot5Form.register('verificationCode')}
              aria-invalid={!!step1dot5Form.formState.errors.verificationCode}
            />
            {step1dot5Form.formState.errors.verificationCode && (
              <p className="text-sm text-destructive">{step1dot5Form.formState.errors.verificationCode.message}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={isVerifyingEmail}>
              {isVerifyingEmail ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Step 2: Profile Information */}
      {step === 2 && (
        <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Tell us about yourself</h3>
            <p className="text-sm text-muted-foreground">
              This helps us match you with the right opportunities
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                First Name
              </label>
              <Input
                id="firstName"
                placeholder="John"
                {...step2Form.register('firstName')}
                aria-invalid={!!step2Form.formState.errors.firstName}
              />
              {step2Form.formState.errors.firstName && (
                <p className="text-sm text-destructive">{step2Form.formState.errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                Last Name
              </label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...step2Form.register('lastName')}
                aria-invalid={!!step2Form.formState.errors.lastName}
              />
              {step2Form.formState.errors.lastName && (
                <p className="text-sm text-destructive">{step2Form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="visaType" className="text-sm font-medium text-foreground">
              Visa Type
            </label>
            <select
              id="visaType"
              {...step2Form.register('visaType')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {VISA_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="visaExpiry" className="text-sm font-medium text-foreground">
              Visa Expiry Date
            </label>
            <Input
              id="visaExpiry"
              type="date"
              {...step2Form.register('visaExpiry')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="linkedInUrl" className="text-sm font-medium text-foreground">
              LinkedIn Profile (optional)
            </label>
            <Input
              id="linkedInUrl"
              type="url"
              placeholder="https://linkedin.com/in/your-profile"
              {...step2Form.register('linkedInUrl')}
              aria-invalid={!!step2Form.formState.errors.linkedInUrl}
            />
            {step2Form.formState.errors.linkedInUrl && (
              <p className="text-sm text-destructive">{step2Form.formState.errors.linkedInUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium text-foreground">
              Location (optional)
            </label>
            <Input
              id="location"
              type="text"
              placeholder="Sydney, NSW"
              {...step2Form.register('location')}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1.5)}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Complete
            </Button>
          </div>
        </form>
      )}

      {/* Login link */}
      {step === 1 && (
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      )}
    </div>
  )
}
