import { v2 as cloudinary } from "cloudinary"
import { NextRequest, NextResponse } from "next/server"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    console.log("=== Upload API Called ===")
    
    // Validate Cloudinary configuration
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Cloudinary configuration missing:", {
        cloudName: !!cloudName,
        apiKey: !!apiKey,
        apiSecret: !!apiSecret
      })
      return NextResponse.json(
        { error: "Cloudinary is not configured properly" },
        { status: 500 }
      )
    }
    
    console.log("Cloudinary config validated")
    
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("No file in form data")
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    console.log("File received:", {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    console.log("File converted to buffer, size:", buffer.length)

    // Upload using a Promise wrapper properly typed
    console.log("Starting Cloudinary upload...")
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "aura-flowers",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error)
            reject(error)
          } else {
            console.log("Cloudinary upload success:", result?.secure_url)
            resolve(result)
          }
        }
      )
      
      uploadStream.end(buffer)
    })

    return NextResponse.json({ 
      url: result.secure_url,
      public_id: result.public_id 
    })
  } catch (error: any) {
    console.error("Upload error:", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack
    })
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    )
  }
}
