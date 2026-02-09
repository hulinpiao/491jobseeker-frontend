import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const navigate = useNavigate()

  const handleBack = () => {
    // Navigate back to jobs list
    navigate(-1)
  }

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      data-testid="back-button"
    >
      <ArrowLeft className="h-4 w-4" />
      <span>Back to Jobs</span>
    </button>
  )
}
