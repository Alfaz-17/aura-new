/**
 * Optimizes a Cloudinary URL by adding transformations for size and quality.
 * This helps save bandwidth and reduces AI token consumption.
 */
export function optimizeCloudinaryUrl(url: string, width = 800, quality = 75): string {
  if (!url || !url.includes("cloudinary.com")) return url

  // Only apply transformations to /upload/ images
  if (url.includes("/upload/v")) {
    const transformation = `w_${width},c_limit,q_${quality}/`
    return url.replace("/upload/", `/upload/${transformation}`)
  }
  
  // Basic replacement if versioning isn't standard
  if (url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/w_${width},c_limit,q_${quality}/`)
  }

  return url
}
