import { removeBackground } from "@imgly/background-removal"

// Configuration for the background removal
const config = {
  progress: (key: string, current: number, total: number) => {
    // Optional: You can hook this up to a progress bar if needed
    // console.log(`Downloading ${key}: ${Math.round((current / total) * 100)}%`)
  },
  debug: false // Set to true for debugging
}

/**
 * Removes the background from a given image file using client-side AI.
 * @param imageFile The image file (Blob or File) to process
 * @returns A Promise resolving to a Blob of the image with transparent background
 */
export async function removeBackgroundClient(imageFile: File | Blob): Promise<Blob> {
  try {
    console.log("[BG Client] Starting background removal...")
    // @ts-ignore
    const blob = await removeBackground(imageFile, config)
    console.log("[BG Client] ✓ Background removed successfully")
    return blob
  } catch (error) {
    console.error("[BG Client] Error removing background:", error)
    throw new Error("Failed to remove background")
  }
}
