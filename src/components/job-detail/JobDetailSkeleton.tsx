import { Card } from '@/components/ui/Card'

export function JobDetailSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        {/* Back Button Skeleton */}
        <div className="mb-6 h-6 w-24 animate-pulse rounded bg-muted" />

        {/* Job Header Card */}
        <Card className="mb-6 p-6">
          <div className="mb-4 h-8 w-3/4 animate-pulse rounded bg-muted" />
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-20 animate-pulse rounded bg-muted" />
          </div>
        </Card>

        {/* Action Buttons Skeleton */}
        <div className="mb-6 flex justify-end gap-2">
          <div className="h-10 w-20 animate-pulse rounded bg-muted" />
          <div className="h-10 w-36 animate-pulse rounded bg-muted" />
          <div className="h-10 w-28 animate-pulse rounded bg-muted" />
        </div>

        {/* Description Card */}
        <Card className="p-6">
          <div className="mb-4 h-6 w-40 animate-pulse rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
          </div>
        </Card>
      </main>
    </div>
  )
}
