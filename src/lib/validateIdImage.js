/**
 * Validates that an uploaded file looks like a genuine ID document.
 * Runs client-side checks before upload to catch obvious mistakes.
 *
 * Checks performed:
 *  1. File type — must be an image (JPEG, PNG, WEBP, HEIC)
 *  2. File size  — must be between 10KB and 10MB
 *  3. Image dimensions — width and height must each be >= 200px
 *  4. Aspect ratio — width should be wider than 0.5× height (not a tall portrait selfie)
 *
 * @param {File} file - The file selected by the user
 * @returns {Promise<{ valid: boolean, error: string | null }>}
 */
export function validateIdImage(file) {
  return new Promise((resolve) => {
    // 1. File type check
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      resolve({
        valid: false,
        error: 'Invalid file type. Please upload a clear photo of your ID (JPEG, PNG, or WEBP). PDFs are not accepted for ID uploads.'
      })
      return
    }

    // 2. File size check (10KB min, 10MB max)
    const MIN_SIZE = 10 * 1024       // 10 KB
    const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
    if (file.size < MIN_SIZE) {
      resolve({
        valid: false,
        error: 'The image file is too small. Please upload a clear, full-resolution photo of your ID.'
      })
      return
    }
    if (file.size > MAX_SIZE) {
      resolve({
        valid: false,
        error: 'Image is too large (max 10MB). Please compress or resize the photo and try again.'
      })
      return
    }

    // 3 & 4. Dimensions and aspect ratio
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const { naturalWidth: w, naturalHeight: h } = img

      // Minimum resolution — must be at least 200×200
      if (w < 200 || h < 200) {
        resolve({
          valid: false,
          error: `Image resolution is too low (${w}×${h}px). Please upload a higher quality photo of your ID.`
        })
        return
      }

      // Aspect ratio — height must not be more than 2× the width 
      // This rejects obvious portrait selfies / random pictures
      if (h > w * 2) {
        resolve({
          valid: false,
          error: 'This looks like a portrait photo, not an ID document. Please upload a flat, landscape photo of your ID card.'
        })
        return
      }

      resolve({ valid: true, error: null })
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      resolve({
        valid: false,
        error: 'Could not read this image file. Please try a different photo.'
      })
    }

    img.src = objectUrl
  })
}
