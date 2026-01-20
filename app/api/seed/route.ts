import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectToDatabase } from "@/lib/mongodb"
import { AdminUser } from "@/models/AdminUser"
import { Item } from "@/models/Item"

const seedItems = [
  {
    title: "Elegant Orchid Arrangement",
    description: "A stunning artificial orchid arrangement featuring premium silk blooms in a modern ceramic vessel. Perfect for living rooms and office spaces.",
    category: "artificial-flowers",
    images: ["/luxury-artificial-orchid-arrangement.jpg"],
    price: 4500,
    material: "Premium Silk, Ceramic",
  },
  {
    title: "Botanical Stone Accent",
    description: "Minimalist botanical arrangement set on natural stone. A perfect blend of organic textures for contemporary interiors.",
    category: "artificial-flowers",
    images: ["/minimal-botanical-arrangement-on-stone.jpg"],
    price: 3200,
    material: "Faux Botanicals, Natural Stone",
  },
  {
    title: "Grand Floral Wall Installation",
    description: "Large-scale artificial floral wall installation for events, weddings, and commercial spaces. Customizable design available.",
    category: "hanging-greenery",
    images: ["/large-artificial-floral-installation-wall.jpg"],
    price: 25000,
    dimensions: "8ft x 12ft",
    material: "Premium Silk Flowers, Metal Frame",
  },
  {
    title: "Luxury Interior Greenery",
    description: "Transform your interior with our luxury artificial greenery collection. Maintenance-free botanical beauty.",
    category: "artificial-green-plants",
    images: ["/luxury-interior-with-artificial-floral-installatio.jpg"],
    price: 8500,
    material: "Real-touch Foliage",
  },
  {
    title: "Ceramic Gradient Pot",
    description: "Handcrafted ceramic pot with beautiful gradient finish. Perfect for tabletop arrangements.",
    category: "decor-accessories",
    images: ["/ceramic-gradient-pot-minimal.jpg"],
    price: 1800,
    dimensions: "25cm x 20cm",
    material: "Hand-thrown Ceramic",
  },
  {
    title: "Handcrafted Console Table",
    description: "Artisan-made console table perfect for displaying floral arrangements and decorative accessories.",
    category: "decor-accessories",
    images: ["/minimal-handcrafted-console-table.jpg"],
    price: 18500,
    dimensions: "120cm x 40cm x 80cm",
    material: "Solid Wood, Metal Accents",
  },
]

export async function GET() {
  try {
    await connectToDatabase()

    // Seed admin user
    const adminEmail = process.env.ADMIN_EMAIL || "admin@aurahouseofflowers.com"
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

    const existingAdmin = await AdminUser.findOne({ email: adminEmail })
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      await AdminUser.create({
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      })
      console.log("Admin user created")
    }

    // Seed items
    for (const itemData of seedItems) {
      const existingItem = await Item.findOne({ title: itemData.title })
      if (!existingItem) {
        await Item.create(itemData)
        console.log(`Created item: ${itemData.title}`)
      }
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      admin: adminEmail,
      items: seedItems.length,
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    )
  }
}
