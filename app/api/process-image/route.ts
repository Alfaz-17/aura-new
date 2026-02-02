import { NextRequest, NextResponse } from "next/server"
import { removeBackground, applyBackground, type BackgroundType } from "@/lib/background-removal"

/**
 * API Route: Process Product Image
 * Removes background and applies professional background
 */

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, backgroundType = 'white' } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      )
    }

    console.log('[Process Image] Starting background removal for:', imageUrl)

    // Step 1: Remove background using Remove.bg
    const transparentBase64 = await removeBackground(imageUrl)

    // Step 2: Upload transparent PNG to Cloudinary
    const signRes = await fetch(`${request.nextUrl.origin}/api/sign-cloudinary`, {
      method: "POST",
    })

    if (!signRes.ok) {
      throw new Error("Failed to get Cloudinary signature")
    }

    const { signature, timestamp, folder, api_key, cloud_name } = await signRes.json()

    // Convert base64 to blob for upload
    const blob = Buffer.from(transparentBase64, 'base64')
    const formData = new FormData()
    formData.append("file", new Blob([blob], { type: 'image/png' }), "processed.png")
    formData.append("api_key", api_key)
    formData.append("timestamp", timestamp.toString())
    formData.append("signature", signature)
    formData.append("folder", folder)

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`
    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    })

    if (!uploadRes.ok) {
      const errorData = await uploadRes.json()
      throw new Error(errorData.error?.message || "Cloudinary upload failed")
    }

    const uploadData = await uploadRes.json()
    
    // Step 3: Apply background transformation
    const finalUrl = applyBackground(uploadData.secure_url, backgroundType as BackgroundType)

    console.log('[Process Image] ✓ Image processed successfully')

    return NextResponse.json({
      success: true,
      originalUrl: imageUrl,
      processedUrl: finalUrl,
      transparentUrl: uploadData.secure_url, // URL without background
    })

  } catch (error: any) {
    console.error("[Process Image] Error:", error)
    
    return NextResponse.json(
      {
        error: error.message || "Image processing failed",
        details: error.toString(),
      },
      { status: 500 }
    )
  }
}
