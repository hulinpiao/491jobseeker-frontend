import { Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { JobListPage } from './pages/JobListPage'
import { JobDetailPage } from './pages/JobDetailPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/jobs" element={<JobListPage />} />
      <Route path="/jobs/:jobId" element={<JobDetailPage />} />
    </Routes>
  )
}

export default App
