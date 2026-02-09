import { Routes, Route } from 'react-router-dom'
import { JobListPage } from './pages/JobListPage'
import { JobDetailPage } from './pages/JobDetailPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<JobListPage />} />
      <Route path="/jobs/:jobId" element={<JobDetailPage />} />
    </Routes>
  )
}

export default App
