import { useQueryClient } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface JobDetailErrorProps {
  error: unknown
}

export function JobDetailError({ error }: JobDetailErrorProps) {
  const queryClient = useQueryClient()

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['job'] })
  }

  const errorMessage = error instanceof Error ? error.message : 'An error occurred'

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-bold">491 JobSeeker</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        <Card className="p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold">Failed to Load Job</h2>
            <p className="text-muted-foreground">{errorMessage}</p>
            <Button onClick={handleRetry}>Try Again</Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
