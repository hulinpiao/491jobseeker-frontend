/**
 * ResumeUploader Component
 * Single Responsibility: Handle resume file upload with drag-and-drop
 */

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import { resumeApi } from '@/services/resumeApi'
import type { UploadResult } from '@/types/resume'

interface ResumeUploaderProps {
  onUploadSuccess: (data: { resumeId: string; fileName: string }) => void
  onUploadError?: (error: Error) => void
}

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export function ResumeUploader({
  onUploadSuccess,
  onUploadError,
}: ResumeUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setError(null)
      setUploading(true)
      setProgress(0)

      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90))
        }, 200)

        const result: UploadResult = await resumeApi.uploadResume(file)

        clearInterval(progressInterval)
        setProgress(100)

        onUploadSuccess({
          resumeId: result.resumeId,
          fileName: result.fileName,
        })
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Upload failed'
        setError(errorMessage)
        onUploadError?.(new Error(errorMessage))
      } finally {
        setUploading(false)
      }
    },
    [onUploadSuccess, onUploadError]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          ['.docx'],
        'text/plain': ['.txt'],
      },
      maxSize: MAX_SIZE,
      multiple: false,
    })

  const getFileError = (): string | null => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0]
      const errorCode = rejection.errors[0]?.code

      if (errorCode === 'file-too-large') {
        return 'File size exceeds 5MB limit'
      }
      if (errorCode === 'file-invalid-type') {
        return 'Invalid file type. Allowed: PDF, DOC, DOCX, TXT'
      }
    }
    return error
  }

  const errorMessage = getFileError()

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
            <p className="text-sm text-muted-foreground">
              Uploading... {progress}%
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Upload className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">
                {isDragActive
                  ? 'Drop your resume here'
                  : 'Drag & drop your resume'}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOC, DOCX, TXT (max 5MB)
            </p>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mt-4 flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <X className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  )
}
