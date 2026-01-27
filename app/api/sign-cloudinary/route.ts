import { v2 as cloudinary } from "cloudinary"
import { NextResponse } from "next/server"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const folder = "aura-flowers"

    // Generate Signature
    // Note: The parameters signed MUST match the parameters sent to the upload API
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET!
    )

    return NextResponse.json({
      timestamp,
      folder,
      signature,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    })
  } catch (error: any) {
    console.error("Signing error:", error)
    return NextResponse.json(
      { error: "Failed to sign upload request" },
      { status: 500 }
    )
  }
}
