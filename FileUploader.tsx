'use client'

import { useCallback, useState } from 'react'
import { generateReactHelpers } from '@uploadthing/react'
import type { OurFileRouter } from '@/lib/uploadthing'

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

type UploadedFile = {
  url: string
  name: string
  size: number
}

type Props = {
  onUploadComplete: (file: UploadedFile) => void
  onUploadError?: (error: Error) => void
}

const ACCEPTED_EXTENSIONS = ['.pdf', '.ai', '.psd', '.png', '.jpg', '.jpeg', '.tiff', '.tif', '.eps']

export function FileUploader({ onUploadComplete, onUploadError }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { startUpload, isUploading, uploadProgress } = useUploadThing('designUploader', {
    onClientUploadComplete: (res) => {
      if (res?.[0]) {
        const file: UploadedFile = {
          url: res[0].url,
          name: res[0].name,
          size: res[0].size,
        }
        setUploadedFile(file)
        onUploadComplete(file)
      }
    },
    onUploadError: (err) => {
      setError(err.message)
      onUploadError?.(err)
    },
  })

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return
      setError(null)
      await startUpload(Array.from(files))
    },
    [startUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  if (uploadedFile) {
    return (
      <div className="border-2 border-green-500 border-solid rounded-xl p-6 bg-green-50">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-green-800">File uploaded successfully</p>
            <p className="text-sm text-green-700 truncate">{uploadedFile.name}</p>
            <p className="text-xs text-green-600 mt-1">
              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={() => setUploadedFile(null)}
            className="text-green-600 hover:text-green-800 text-sm underline"
          >
            Replace
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'}
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {isUploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin" />
            <p className="text-sm font-medium text-gray-700">Uploading... {uploadProgress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-base font-medium text-gray-700">
                Drop your design file here
              </p>
              <p className="text-sm text-gray-500">or click to browse</p>
            </div>
            <p className="text-xs text-gray-400">
              PDF, AI, PSD, PNG, JPG, TIFF, EPS — up to 128MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}
    </div>
  )
}
