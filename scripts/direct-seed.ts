import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import * as dotenv from "dotenv"
import path from "path"

dotenv.config({ path: ".env.local" })

const MONGODB_URI = process.env.MONGODB_URI
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@aurahouseofflowers.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined")
  process.exit(1)
}

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  images: { type: [String], default: [] },
  category: { type: String, required: true },
  price: Number,
  dimensions: String,
  material: String,
}, { timestamps: true })

const AdminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
}, { timestamps: true })

const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema)
const AdminUser = mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema)

const seedItems = [
  {
    title: "Elegant Orchid Arrangement",
    slug: "elegant-orchid-arrangement",
    description: "A stunning artificial orchid arrangement featuring premium silk blooms in a modern ceramic vessel.",
    category: "artificial-flowers",
    images: ["/luxury-artificial-orchid-arrangement.jpg"],
    price: 4500,
    material: "Premium Silk, Ceramic",
  },
  {
    title: "Botanical Stone Accent",
    slug: "botanical-stone-accent",
    description: "Minimalist botanical arrangement set on natural stone.",
    category: "artificial-flowers",
    images: ["/minimal-botanical-arrangement-on-stone.jpg"],
    price: 3200,
    material: "Faux Botanicals, Natural Stone",
  },
  {
      title: "Grand Floral Wall Installation",
      slug: "grand-floral-wall-installation",
      description: "Large-scale artificial floral wall installation for events, weddings, and commercial spaces.",
      category: "hanging-greenery",
      images: ["/large-artificial-floral-installation-wall.jpg"],
      price: 25000,
      dimensions: "8ft x 12ft",
      material: "Premium Silk Flowers, Metal Frame",
    },
    {
      title: "Luxury Interior Greenery",
      slug: "luxury-interior-greenery",
      description: "Transform your interior with our luxury artificial greenery collection.",
      category: "artificial-green-plants",
      images: ["/luxury-interior-with-artificial-floral-installatio.jpg"],
      price: 8500,
      material: "Real-touch Foliage",
    },
    {
      title: "Ceramic Gradient Pot",
      slug: "ceramic-gradient-pot",
      description: "Handcrafted ceramic pot with beautiful gradient finish.",
      category: "decor-accessories",
      images: ["/ceramic-gradient-pot-minimal.jpg"],
      price: 1800,
      dimensions: "25cm x 20cm",
      material: "Hand-thrown Ceramic",
    },
    {
      title: "Handcrafted Console Table",
      slug: "handcrafted-console-table",
      description: "Artisan-made console table perfect for displaying floral arrangements.",
      category: "decor-accessories",
      images: ["/minimal-handcrafted-console-table.jpg"],
      price: 18500,
      dimensions: "120cm x 40cm x 80cm",
      material: "Solid Wood, Metal Accents",
    },
  {
    title: "Cymbidium Artistry",
    slug: "signature-orchid-concept",
    description: "A masterclass in structural elegance. The Cymbidium Artistry is the crown jewel of our Signature Series.",
    category: "artificial-flowers",
    images: ["/cinematic-orchid.png", "/luxury-artificial-orchid-arrangement.jpg"],
    price: 12500,
    material: "Real-touch Silk, Burnished Ceramic Vessel",
  },
  {
    title: "Royal Ceremonial Centerpiece",
    slug: "ceremonial-centerpiece",
    description: "The heartbeat of Gujarat's grand celebrations. A grand architectural marvel for weddings.",
    category: "hanging-greenery",
    images: ["/cinematic-centerpiece.png", "/large-artificial-floral-installation-wall.jpg"],
    price: 45000,
    material: "Signature Gold-leaf accents, Premium Hybrid Florals",
  },
  {
    title: "Architectural Vessel & Bloom",
    slug: "ceramic-vessel-botanical",
    description: "A tribute to minimalist design, this piece pairs our handcrafted gradient ceramic vessels with a singular, striking botanical stem.",
    category: "decor-accessories",
    images: ["/collection_ceramic_vessels.png", "/ceramic-gradient-pot-minimal.jpg"],
    price: 7500,
    material: "Hand-thrown Ceramic, Minimalist Faux Botanical",
  }
]

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI!)
    console.log("Connected to MongoDB")

    // Admin user (if needed for DB storage, though we switched to env-only auth, 
    // keeping it for schema consistency)
    const existingAdmin = await AdminUser.findOne({ email: ADMIN_EMAIL })
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12)
      await AdminUser.create({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      })
      console.log("Admin user created in DB")
    }

    // Items
    for (const itemData of seedItems) {
      const existingItem = await Item.findOne({ slug: itemData.slug })
      if (!existingItem) {
        await Item.create(itemData)
        console.log(`Created item: ${itemData.title}`)
      }
    }

    console.log("Seeding complete!")
    process.exit(0)
  } catch (error) {
    console.error("Seed error:", error)
    process.exit(1)
  }
}

seed()
