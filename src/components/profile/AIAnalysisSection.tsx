/**
 * AIAnalysisSection Component
 * Single Responsibility: Display AI resume analysis results
 */

import { useState } from 'react'
import { Sparkles, AlertCircle, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DisclosureTriangle } from '@/components/ui/DisclosureTriangle'
import { Badge } from '@/components/ui/Badge'
import { resumeApi } from '@/services/resumeApi'
import type { AnalysisResult } from '@/types/resume'

interface AIAnalysisSectionProps {
  resumeId: string
  onAnalysisComplete: (result: AnalysisResult) => void
}

export function AIAnalysisSection({
  resumeId,
  onAnalysisComplete,
}: AIAnalysisSectionProps) {
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    setError(null)
    setAnalyzing(true)

    try {
      const analysisResult = await resumeApi.analyzeResume(resumeId)
      setResult(analysisResult)
      onAnalysisComplete(analysisResult)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Analysis failed. Please try again.'
      setError(errorMessage)
    } finally {
      setAnalyzing(false)
    }
  }

  if (result) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">AI Analysis Results</h2>
        </div>

        {/* Skills */}
        <div>
          <h3 className="font-semibold mb-3">Skills</h3>
          <div className="space-y-2">
            {result.skills.map((category) => (
              <DisclosureTriangle key={category.category} title={category.category}>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </DisclosureTriangle>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <h3 className="font-semibold mb-3">Summary</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {result.summary}
          </p>
        </div>

        {/* Job Keywords */}
        <div>
          <h3 className="font-semibold mb-3">Recommended Job Titles</h3>
          <div className="flex flex-wrap gap-2">
            {result.jobKeywords.map((keyword) => (
              <Badge key={keyword} variant="default">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="h-6 w-6 text-primary" />
        <h2 className="text-lg font-semibold">Analyze Your Resume</h2>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Get AI-powered insights into your skills, strengths, and recommended job
        titles.
      </p>

      {error && (
        <div className="flex items-start gap-3 rounded-md bg-destructive/10 p-4 text-sm text-destructive mb-4">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Analysis Failed</p>
            <p className="text-xs opacity-90">{error}</p>
          </div>
        </div>
      )}

      <Button onClick={handleAnalyze} disabled={analyzing} className="w-full">
        {analyzing ? (
          <>
            <RotateCw className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Analyze Resume with AI
          </>
        )}
      </Button>
    </div>
  )
}
