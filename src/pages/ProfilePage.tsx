/**
 * ProfilePage Component
 * Single Responsibility: Display and manage user profile
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, MapPin, Briefcase, Linkedin, Calendar } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

const VISA_TYPE_LABELS: Record<string, string> = {
  '491': 'Skilled Work Regional (Provisional) (491)',
  '494': 'Skilled Employer Sponsored Regional (Provisional) (494)',
  '482': 'Temporary Skill Shortage (482)',
  '186': 'Employer Nomination Scheme (186)',
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, isLoggingOut, updateProfile, isUpdatingProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    visaType: user?.visaType || '',
    visaExpiry: user?.visaExpiry || '',
    linkedInUrl: user?.linkedInUrl || '',
    location: user?.location || '',
  })

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleSave = async () => {
    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch {
      // Error is handled by useAuth hook
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      visaType: user?.visaType || '',
      visaExpiry: user?.visaExpiry || '',
      linkedInUrl: user?.linkedInUrl || '',
      location: user?.location || '',
    })
    setIsEditing(false)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <h1 className="text-xl font-bold">491 JobSeeker</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout} disabled={isLoggingOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle>{user.fullName || `${user.firstName} ${user.lastName}`}</CardTitle>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Visa Information */}
            {user.visaType && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Visa Type:</span>
                <Badge variant="secondary">{VISA_TYPE_LABELS[user.visaType] || user.visaType}</Badge>
              </div>
            )}

            {/* Visa Expiry */}
            {user.visaExpiry && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Visa Expiry:</span>
                <span className="text-sm">{new Date(user.visaExpiry).toLocaleDateString()}</span>
              </div>
            )}

            {/* Location */}
            {user.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Location:</span>
                <span className="text-sm">{user.location}</span>
              </div>
            )}

            {/* LinkedIn */}
            {user.linkedInUrl && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">LinkedIn:</span>
                <a
                  href={user.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {user.linkedInUrl}
                </a>
              </div>
            )}

            {/* Edit Form */}
            {isEditing && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="visaType" className="text-sm font-medium">
                    Visa Type
                  </label>
                  <select
                    id="visaType"
                    value={formData.visaType}
                    onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">No visa selected</option>
                    <option value="491">Skilled Work Regional (491)</option>
                    <option value="494">Skilled Employer Sponsored Regional (494)</option>
                    <option value="482">Temporary Skill Shortage (482)</option>
                    <option value="186">Employer Nomination Scheme (186)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="visaExpiry" className="text-sm font-medium">
                    Visa Expiry Date
                  </label>
                  <Input
                    id="visaExpiry"
                    type="date"
                    value={formData.visaExpiry}
                    onChange={(e) => setFormData({ ...formData, visaExpiry: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location
                  </label>
                  <Input
                    id="location"
                    placeholder="Sydney, NSW"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="linkedInUrl" className="text-sm font-medium">
                    LinkedIn URL
                  </label>
                  <Input
                    id="linkedInUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                    value={formData.linkedInUrl}
                    onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Account Info */}
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
