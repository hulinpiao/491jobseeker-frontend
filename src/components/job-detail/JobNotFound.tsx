import { useNavigate } from 'react-router-dom'
import { FileX } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export function JobNotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      {/* Main Content */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        <Card className="p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <FileX className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Job Not Found</h2>
            <p className="text-muted-foreground">
              The job you are looking for does not exist or has been removed.
            </p>
            <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
