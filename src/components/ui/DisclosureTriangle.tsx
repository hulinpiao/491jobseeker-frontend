/**
 * DisclosureTriangle Component
 * Single Responsibility: Collapsible content section with chevron indicator
 */

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface DisclosureTriangleProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
}

export function DisclosureTriangle({
  title,
  children,
  defaultExpanded = false,
}: DisclosureTriangleProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="border rounded-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left font-medium hover:bg-muted/50"
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isExpanded && <div className="border-t px-4 py-3">{children}</div>}
    </div>
  )
}
