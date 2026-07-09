'use client'

import { useCallback, useState } from 'react'

type UploadedFile = {
  url: string
  name: string
  size: number
}

type Props = {
  onUploadComplete: (file: UploadedFile) => void
  onUploadError?: (error: Error) => void
}

export function FileUploader({ onUploadComplete, onUploadError }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleUpload = useCallback(
    async (file: File) => {
      setIsUploading(true)
      setFileName(file.name)
      setProgress(0)

      try {
        const formData = new FormData()
        formData.append('files', file)

        // Simulate progress during XHR
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90))
        }, 200)

        const res = await fetch('/api/uploadthing', {
          method: 'POST',
          body: formData,
        })

        clearInterval(progressInterval)

        if (!res.ok) {
          throw new Error('Upload failed')
        }

        const data = await res.json()
        setProgress(100)

        // UploadThing returns the file info
        const uploaded: UploadedFile = {
          url: data[0]?.url || data.url || '',
          name: file.name,
          size: file.size,
        }

        onUploadComplete(uploaded)
      } catch (err) {
        onUploadError?.(err instanceof Error ? err : new Error('Upload failed'))
      } finally {
        setIsUploading(false)
      }
    },
    [onUploadComplete, onUploadError]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleUpload(file)
    },
    [handleUpload]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleUpload(file)
    },
    [handleUpload]
  )

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer
        ${isDragging
          ? 'border-teal bg-teal/5'
          : 'border-border hover:border-teal/40 hover:bg-teal/[0.02]'}
      `}
    >
      <input
        type="file"
        accept=".pdf,.ai,.psd,.png,.jpg,.jpeg,.tiff,.tif,.eps"
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />

      {isUploading ? (
        <div className="space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-teal/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-teal animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">Uploading {fileName}...</p>
          <div className="w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-teal h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">{progress}%</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-14 h-14 mx-auto rounded-xl bg-teal/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              Drag & drop your design file, or <span className="text-teal">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PDF, AI, PSD, PNG, JPG, TIFF — up to 64MB
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
