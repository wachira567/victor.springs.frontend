import { toast } from 'sonner'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

/**
 * Force-download a file in-page without redirecting.
 * Strategy:
 *   1. For Cloudinary URLs: fetch directly with fl_attachment transform
 *   2. Fallback: backend proxy
 *   3. Last resort: hidden anchor with download attribute
 */
export async function downloadFile(url, filename = 'document.pdf') {
  if (!url) {
    toast.error('No file URL available')
    return
  }

  toast.info('Downloading...')

  // Step 1: Try direct fetch
  // For Cloudinary image-type URLs: inject fl_attachment
  // For raw-type URLs: fetch as-is (they are public and support no transforms)
  let fetchUrl = url
  if (url.includes('cloudinary.com') && url.includes('/image/upload/') && !url.includes('fl_attachment')) {
    fetchUrl = url.replace('/image/upload/', '/image/upload/fl_attachment/')
  }

  try {
    const resp = await fetch(fetchUrl)
    if (resp.ok) {
      const blob = await resp.blob()
      triggerDownload(blob, filename)
      toast.success('Download complete')
      return
    }
  } catch (e) {
    // CORS or network error — try proxy
  }

  // Step 2: Try backend proxy
  try {
    const token = localStorage.getItem('victorsprings_token')
    const proxyUrl = `${API_URL}/download/?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`
    const resp = await fetch(proxyUrl, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    if (resp.ok) {
      const blob = await resp.blob()
      triggerDownload(blob, filename)
      toast.success('Download complete')
      return
    }
  } catch (e) {
    // Proxy not available
  }

  // Step 3: Last resort — anchor download (may open in new tab for PDFs)
  const link = document.createElement('a')
  link.href = fetchUrl
  link.download = filename
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  document.body.appendChild(link)
  link.click()
  link.remove()
  toast.success('Download started')
}

function triggerDownload(blob, filename) {
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
}
