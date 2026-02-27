import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

/**
 * Downloads a file via the backend proxy — guarantees direct download
 * without page redirect, CORS, or CDN format issues.
 *
 * @param {string} url - The file URL (Cloudinary, Uploadcare, etc.)
 * @param {string} filename - Desired filename (e.g. "agreement.pdf")
 */
export async function downloadFile(url, filename = 'document.pdf') {
  if (!url) {
    toast.error('No file URL available')
    return
  }

  const token = localStorage.getItem('victorsprings_token')

  try {
    toast.info('Downloading...')

    // Route through backend proxy for reliable delivery
    const proxyUrl = `${API_URL}/download/?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`

    const response = await fetch(proxyUrl, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl)
      link.remove()
    }, 100)

    toast.success('Download complete')
  } catch (err) {
    console.error('Download failed:', err)
    toast.error('Download failed. Please try again.')
  }
}
