/**
 * ResumeDisplay Component
 * Single Responsibility: Display uploaded resume with delete option
 */

import { FileText, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ResumeDisplayProps {
  fileName: string
  uploadDate: Date
  onDelete: () => void
}

export function ResumeDisplay({
  fileName,
  uploadDate,
  onDelete,
}: ResumeDisplayProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-medium">{fileName}</p>
          <p className="text-sm text-muted-foreground">
            Uploaded {uploadDate.toLocaleDateString()}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
