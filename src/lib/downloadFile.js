import { toast } from 'sonner'

/**
 * Downloads a file directly in the current page without redirecting.
 * Uses fetch + Blob to force a browser download dialog.
 * Falls back to opening URL if fetch fails due to CORS.
 *
 * @param {string} url - The file URL to download
 * @param {string} filename - Desired filename for the download (e.g. "agreement.pdf")
 */
export async function downloadFile(url, filename = 'document.pdf') {
  if (!url) {
    toast.error('No file URL available')
    return
  }

  try {
    toast.info('Downloading...')

    const response = await fetch(url, { mode: 'cors' })

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

    // Cleanup
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl)
      link.remove()
    }, 100)

    toast.success('Download started')
  } catch (err) {
    console.warn('Direct download failed, using fallback:', err)
    // Fallback: use an anchor tag with download attribute
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
}
