import { Button } from '@/components/ui/Button'

export function ActionButtons() {
  return (
    <div className="flex justify-end gap-2">
      <Button
        disabled
        title="Apply functionality coming soon"
      >
        Apply
      </Button>
      <Button
        disabled
        title="Resume customization coming soon"
        variant="secondary"
      >
        Customize Resume
      </Button>
      <Button
        disabled
        title="CV generation coming soon"
        variant="outline"
      >
        Generate CV
      </Button>
    </div>
  )
}
