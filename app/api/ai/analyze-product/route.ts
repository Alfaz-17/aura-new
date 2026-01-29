import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { connectToDatabase } from "@/lib/mongodb"
import { Category } from "@/models/Category"

// Fallback models in priority order (if quota exceeded)
const GEMINI_MODELS = [
  "gemini-2.5-flash",        // Newest version, try first
  "gemini-2.0-flash-lite",   // Lighter version, lower quota usage
  "gemini-flash-latest",     // Alias to latest available
  "gemini-2.0-flash",        // Original (likely has quota issues)
]

async function analyzeImageWithRetry(
  genAI: GoogleGenerativeAI,
  base64Image: string,
  prompt: string,
  maxRetries = 3
) {
  let lastError: any = null

  // Try each model in sequence
  for (const modelName of GEMINI_MODELS) {
    console.log(`[AI] Attempting with model: ${modelName}`)
    
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: "image/jpeg"
          }
        }
      ])

      console.log(`[AI] ✓ Success with model: ${modelName}`)
      return result.response.text()

    } catch (error: any) {
      lastError = error
      
      // Check if it's a quota error (429)
      if (error.status === 429 || error.message?.includes("quota")) {
        console.warn(`[AI] ✗ Quota exceeded for ${modelName}, trying next model...`)
        continue // Try next model
      }
      
      // Check if it's a rate limit with retry suggestion
      if (error.message?.includes("retry")) {
        const retryMatch = error.message.match(/retry in ([\d.]+)s/)
        if (retryMatch) {
          const waitSeconds = parseFloat(retryMatch[1])
          console.log(`[AI] Rate limited, waiting ${waitSeconds}s before retry...`)
          await new Promise(resolve => setTimeout(resolve, waitSeconds * 1000))
          
          // Retry with same model
          try {
            const model = genAI.getGenerativeModel({ model: modelName })
            const result = await model.generateContent([
              prompt,
              {
                inlineData: {
                  data: base64Image,
                  mimeType: "image/jpeg"
                }
              }
            ])
            console.log(`[AI] ✓ Success after retry with model: ${modelName}`)
            return result.response.text()
          } catch (retryError: any) {
            console.warn(`[AI] ✗ Retry failed for ${modelName}:`, retryError.message)
            lastError = retryError
            continue
          }
        }
      }
      
      // For other errors, throw immediately
      console.error(`[AI] ✗ Error with ${modelName}:`, error.message)
      throw error
    }
  }

  // If all models failed, throw the last error
  throw new Error(`All models failed. Last error: ${lastError?.message || "Unknown error"}`)
}

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
    
    // Create a mapping of both names and slugs for better AI matching
    const categoryList = categories.map(c => `${c.slug} (${c.name})`).join(", ")
    const categorySlugs = categories.map(c => c.slug)

    const genAI = new GoogleGenerativeAI(apiKey)

    // OPTIMIZATION: Use Cloudinary transformations to reduce image size (saves tokens)
    const optimizedImageUrl = imageUrl.includes("cloudinary.com") 
      ? imageUrl.replace("/upload/", "/upload/w_512,c_limit,q_70/") 
      : imageUrl

    console.log(`[AI] Fetching optimized image: ${optimizedImageUrl}`)
    console.log(`[AI] Available categories: ${categorySlugs.join(", ")}`)

    // Fetch image data
    const imageResponse = await fetch(optimizedImageUrl)
    if (!imageResponse.ok) throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
    
    const imageData = await imageResponse.arrayBuffer()
    const base64Image = Buffer.from(imageData).toString("base64")
    console.log(`[AI] Optimized image size: ${imageData.byteLength} bytes`)

    const prompt = `Analyze this luxury floral product image and provide details in JSON format.

IMPORTANT: For the "category" field, you MUST return the exact slug (lowercase with hyphens) from this list:
${categorySlugs.join(", ")}

Available categories with descriptions:
${categoryList}

Return JSON with these exact fields:
{
  "title": "elegant product title",
  "description": "1-2 sentences with premium tone",
  "category": "exact-category-slug-from-list-above",
  "material": "suggested material (e.g., Silk, Polyester, Ceramic)",
  "dimensions": "realistic size estimate (e.g., 30x20cm or 12x8 inches)"
}

Remember: The category value must be one of: ${categorySlugs.join(", ")}`

    // Use retry logic with model fallback
    const responseText = await analyzeImageWithRetry(genAI, base64Image, prompt)
    
    // Extract JSON from response (sometimes Gemini wraps it in markdown blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response as JSON")
    }
    
    const analysis = JSON.parse(jsonMatch[0])
    
    // Validate and correct category if needed
    if (analysis.category) {
      const validCategory = categorySlugs.find(slug => 
        slug === analysis.category || 
        slug.toLowerCase() === analysis.category.toLowerCase()
      )
      
      if (validCategory) {
        analysis.category = validCategory // Ensure exact match
        console.log(`[AI] ✓ Valid category: ${validCategory}`)
      } else {
        console.warn(`[AI] ✗ Invalid category returned: "${analysis.category}"`)
        console.warn(`[AI] Valid options are: ${categorySlugs.join(", ")}`)
        // Don't set a default - let the frontend handle it
        analysis.category = null
      }
    }

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error("AI Analysis Error:", error)
    return NextResponse.json({ 
      error: error.message || "AI Analysis failed",
      details: error.status === 429 ? "API quota exceeded. Please check your billing or try again later." : undefined
    }, { status: error.status || 500 })
  }
}
