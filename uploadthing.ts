import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {
  designUploader: f({
    pdf: { maxFileSize: '64MB' },
    image: { maxFileSize: '64MB' },
    // Accept any other formats as blobs
    blob: { maxFileSize: '128MB' },
  })
    .middleware(async ({ req }) => {
      // You can add auth checks here if needed
      return {}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete:', file.url)
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
