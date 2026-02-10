import { Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { JobListPage } from './pages/JobListPage'
import { JobDetailPage } from './pages/JobDetailPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="/jobs" element={<JobListPage />} />
      <Route path="/jobs/:jobId" element={<JobDetailPage />} />
    </Routes>
  )
}

export default App
