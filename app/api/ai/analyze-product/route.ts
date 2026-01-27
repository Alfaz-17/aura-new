import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { connectToDatabase } from "@/lib/mongodb"
import { Category } from "@/models/Category"

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    await connectToDatabase()
    const categories = await Category.find({ isActive: true }).select("name slug")
    const categoryNames = categories.map(c => c.name).join(", ")

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    console.log("[AI] Analyzing image with gemini-2.0-flash...")

    // OPTIMIZATION: Use Cloudinary transformations to reduce image size (saves tokens)
    const optimizedImageUrl = imageUrl.includes("cloudinary.com") 
      ? imageUrl.replace("/upload/", "/upload/w_512,c_limit,q_70/") 
      : imageUrl

    console.log(`[AI] Fetching optimized image: ${optimizedImageUrl}`)

    // Fetch image data
    const imageResponse = await fetch(optimizedImageUrl)
    if (!imageResponse.ok) throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
    
    const imageData = await imageResponse.arrayBuffer()
    const base64Image = Buffer.from(imageData).toString("base64")
    console.log(`[AI] Optimized image size: ${imageData.byteLength} bytes`)

    const prompt = `Analyze this luxury floral product image.
    Provide JSON:
    "title": elegant title
    "description": 1-2 sentences, premium tone
    "category": exactly one from [${categoryNames}]
    "material": suggested material
    "dimensions": realistic size (e.g. 30x20cm)`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: "image/jpeg"
        }
      }
    ])

    const responseText = result.response.text()
    
    // Extract JSON from response (sometimes Gemini wraps it in markdown blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response as JSON")
    }
    
    const analysis = JSON.parse(jsonMatch[0])

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error("AI Analysis Error:", error)
    return NextResponse.json({ error: error.message || "AI Analysis failed" }, { status: 500 })
  }
}
