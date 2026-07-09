'use client'

type Props = {
  url: string
  fileName: string
}

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'tiff', 'tif']

export function FilePreview({ url, fileName }: Props) {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  const isImage = IMAGE_EXTENSIONS.includes(ext)
  const isPdf = ext === 'pdf'

  if (isImage) {
    return (
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white">
          <span className="text-xs font-mono text-gray-500 truncate">{fileName}</span>
        </div>
        <div className="flex items-center justify-center p-4 min-h-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={fileName}
            className="max-w-full max-h-96 object-contain rounded"
          />
        </div>
      </div>
    )
  }

  if (isPdf) {
    return (
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-white">
          <span className="text-xs font-mono text-gray-500 truncate">{fileName}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-blue-600 hover:underline whitespace-nowrap"
          >
            Open in new tab
          </a>
        </div>
        <iframe
          src={`${url}#toolbar=0`}
          className="w-full h-96"
          title={fileName}
        />
      </div>
    )
  }

  // Non-previewable formats (AI, PSD, EPS etc.)
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 truncate">{fileName}</p>
        <p className="text-sm text-gray-500">
          .{ext.toUpperCase()} file — preview not available in browser
        </p>
        <p className="text-xs text-green-600 mt-1">File uploaded and ready for print production</p>
      </div>
      <a
        href={url}
        download={fileName}
        className="text-sm text-blue-600 hover:underline whitespace-nowrap"
      >
        Download
      </a>
    </div>
  )
}
