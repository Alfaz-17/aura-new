"use client"

import { pipeline, RawImage, env } from '@huggingface/transformers';

// Configure environment for browser-only execution
if (typeof window !== 'undefined') {
  env.allowLocalModels = false;
  env.allowRemoteModels = true;
}

let segmenter: any = null;

/**
 * Removes the background from a given image file using client-side AI (Hugging Face Transformers.js).
 * Uses the RMBG-1.4 model which is optimized for background removal.
 * 
 * @param imageFile The image file (Blob or File) to process
 * @returns A Promise resolving to a Blob of the image with transparent background
 */
export async function removeBackgroundClient(imageFile: File | Blob): Promise<Blob> {
  try {
    console.log("[BG Client] Starting background removal with Transformers.js...");
    
    // 1. Initialize segmenter if not already loaded
    if (!segmenter) {
      console.log("[BG Client] Loading model (briaai/RMBG-1.4)...");
      segmenter = await pipeline('image-segmentation', 'briaai/RMBG-1.4', {
        device: 'webgpu', // Try WebGPU first, will fallback to WASM
      });
    }

    // 2. Convert File/Blob to RawImage
    const url = URL.createObjectURL(imageFile);
    const image = await RawImage.fromURL(url);
    URL.revokeObjectURL(url);

    // 3. Process image
    console.log("[BG Client] Processing image...");
    const output = await segmenter(image);
    
    // output is a mask (alpha channel)
    const mask = output[0].mask;
    
    // 4. Create a canvas to apply the mask and get transparent background
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error("Could not get canvas context");

    // Draw original image
    const bitmap = await createImageBitmap(imageFile);
    ctx.drawImage(bitmap, 0, 0);

    // Apply alpha mask
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const maskData = await mask.toCanvas().getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < imageData.data.length; i += 4) {
      // Set alpha channel (index i+3) from the mask's grayscale value
      // Mask is usually grayscale (r=g=b)
      imageData.data[i + 3] = maskData.data[i]; 
    }
    
    ctx.putImageData(imageData, 0, 0);

    // 5. Convert canvas back to Blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          console.log("[BG Client] ✓ Background removed successfully");
          resolve(blob);
        } else {
          reject(new Error("Canvas toBlob failed"));
        }
      }, 'image/png');
    });

  } catch (error) {
    console.error("[BG Client] Error removing background:", error);
    // If WebGPU fails, try forcing WASM (next time)
    segmenter = null; 
    throw new Error("Failed to remove background");
  }
}
