/**
 * Background Removal Utility
 * Handles automatic background removal and professional background application
 */

export type BackgroundType = 'white' | 'gradient' | 'transparent'

interface RemoveBgResponse {
  data: {
    result_b64: string
  }
}

/**
 * Remove background from image using Remove.bg API
 * @param imageUrl - URL of the image to process
 * @returns Base64 encoded image with transparent background
 */
export async function removeBackground(imageUrl: string): Promise<string> {
  const apiKey = process.env.REMOVE_BG_API_KEY

  if (!apiKey) {
    throw new Error('Remove.bg API key not configured')
  }

  try {
    console.log('[BG Removal] Processing image:', imageUrl)

    const formData = new FormData()
    formData.append('image_url', imageUrl)
    formData.append('size', 'auto')
    formData.append('format', 'png') // PNG supports transparency

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[BG Removal] API Error:', error)
      throw new Error(`Remove.bg API failed: ${response.statusText}`)
    }

    // Get the image as blob
    const blob = await response.blob()
    
    // Convert blob to base64
    const arrayBuffer = await blob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    
    console.log('[BG Removal] ✓ Background removed successfully')
    return base64

  } catch (error: any) {
    console.error('[BG Removal] Error:', error)
    throw new Error(`Background removal failed: ${error.message}`)
  }
}

/**
 * Apply professional background to transparent image
 * @param transparentImageBase64 - Base64 encoded PNG with transparent background
 * @param bgType - Type of background to apply
 * @returns Cloudinary URL with applied background
 */
export function applyBackground(
  cloudinaryUrl: string,
  bgType: BackgroundType = 'white'
): string {
  // Use Cloudinary transformations to apply background
  const transformations: Record<BackgroundType, string> = {
    white: 'b_white',
    gradient: 'b_rgb:f5f5f0,g_north_west/e_gradient_fade:symmetric',
    transparent: '', // No background
  }

  const transformation = transformations[bgType]
  
  if (!transformation) {
    return cloudinaryUrl
  }

  // Insert transformation into Cloudinary URL
  return cloudinaryUrl.replace('/upload/', `/upload/${transformation}/`)
}

/**
 * Complete image processing pipeline:
 * 1. Remove background
 * 2. Upload to Cloudinary
 * 3. Apply professional background
 * 
 * @param imageUrl - Original image URL
 * @param bgType - Background type to apply
 * @returns Final processed image URL
 */
export async function processProductImage(
  imageUrl: string,
  bgType: BackgroundType = 'white'
): Promise<string> {
  try {
    // Step 1: Remove background
    const transparentBase64 = await removeBackground(imageUrl)

    // Step 2: Upload transparent image to Cloudinary
    const uploadResponse = await fetch('/api/upload-processed-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        imageBase64: transparentBase64,
        format: 'png'
      }),
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload processed image')
    }

    const { url } = await uploadResponse.json()

    // Step 3: Apply background using Cloudinary transformations
    const finalUrl = applyBackground(url, bgType)

    console.log('[BG Removal] ✓ Complete processing pipeline finished')
    return finalUrl

  } catch (error: any) {
    console.error('[BG Removal] Pipeline error:', error)
    throw error
  }
}
