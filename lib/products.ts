export interface Product {
  id: string
  name: string
  price: number | string
  category: string
  image: string
  hoverImage: string
  description: string
  longDescription: string
  materials: string[]
  care: string[]
  sizes: { size: string; available: boolean }[]
  colors: { name: string; hex: string; available: boolean }[]
  details: string[]
  madeIn: string
}

export const products: Product[] = [
  {
    id: "signature-orchid-concept",
    name: "Cymbidium Artistry",
    price: "Enquire",
    category: "Signature Series",
    image: "/cinematic-orchid.png",
    hoverImage: "/luxury-artificial-orchid-arrangement.jpg",
    description: "A masterclass in structural elegance",
    longDescription:
      "The Cymbidium Artistry is the crown jewel of our Signature Series. Meticulously handcrafted using high-fidelity silk and real-touch materials, this arrangement captures the ethereal beauty of rare orchids. Each piece is custom-set in a hand-burnished vessel, designed to be a permanent statement of luxury in any curated interior.",
    materials: ["Real-touch Silk", "Burnished Ceramic Vessel", "Natural preserved moss"],
    care: ["Light dusting only", "Avoid direct moisture", "Keep out of harsh midday sun"],
    sizes: [
      { size: "Petit", available: true },
      { size: "Classic", available: true },
      { size: "Grand", available: true },
    ],
    colors: [
      { name: "Porcelain", hex: "#F7F7F5", available: true },
      { name: "Dusty Rose", hex: "#D4A5A5", available: true },
      { name: "Golden Hour", hex: "#C9A24D", available: true },
    ],
    details: [
      "Individually hand-painted petals",
      "Signature Aura scent infusion",
      "Numbered Archive edition",
      "Certificate of Floral Artistry",
    ],
    madeIn: "Bhavnagar, Gujarat",
  },
  {
    id: "ceremonial-centerpiece",
    name: "Royal Ceremonial Centerpiece",
    price: "Enquire",
    category: "Wedding & Events",
    image: "/cinematic-centerpiece.png",
    hoverImage: "/large-artificial-floral-installation-wall.jpg",
    description: "The heartbeat of Gujarat's grand celebrations",
    longDescription:
      "Designed by our Gujarat Florist division, this Grand Centerpiece is an architectural marvel. Combining traditional celebratory aesthetics with modern botanical design, it creates a cinematic focal point for weddings and elite ceremonies. The arrangement features a cascading flow of premium florals that evoke a sense of timeless celebration.",
    materials: ["Signature Gold-leaf accents", "Premium Hybrid Florals", "Custom wrought-iron frame"],
    care: ["Professional installation recommended", "Scent refresh service available"],
    sizes: [
      { size: "Gala", available: true },
      { size: "Imperial", available: true },
    ],
    colors: [
      { name: "Royal Gold", hex: "#C9A24D", available: true },
      { name: "Majestic Blue", hex: "#0E2A47", available: true },
      { name: "Soft Peach", hex: "#E7B8A4", available: true },
    ],
    details: [
      "Intertwined traditional motifs",
      "High-output cinematic lighting compatible",
      "Bespoke Gujarat Florist branding",
    ],
    madeIn: "Bhavnagar, Gujarat",
  },
  {
    id: "ceramic-vessel-botanical",
    name: "Architectural Vessel & Bloom",
    price: "Enquire",
    category: "Decorative Vessels",
    image: "/collection_ceramic_vessels.png",
    hoverImage: "/ceramic-gradient-pot-minimal.jpg",
    description: "Minimalist harmony of clay and stem",
    longDescription:
      "A tribute to minimalist design, this piece pairs our handcrafted gradient ceramic vessels with a singular, striking botanical stem. Inspired by the quiet landscapes of Gujarat, it emphasizes the emotional power of negative space and the raw beauty of natural forms.",
    materials: ["Hand-thrown Ceramic", "Minimalist Faux Botanical", "Weighted base for stability"],
    care: ["Wipe vessel with damp cloth", "Handle with care"],
    sizes: [
      { size: "Tall", available: true },
      { size: "Wide", available: true },
    ],
    colors: [
      { name: "Sandstone", hex: "#D2B48C", available: true },
      { name: "Earth", hex: "#3E2723", available: true },
      { name: "Cloud", hex: "#F7F7F5", available: true },
    ],
    details: ["Unique gradient finish", "Aura house stamp on base", "Limited production"],
    madeIn: "Bhavnagar, Gujarat",
  },
]

export const categories = ["All", "Signature Series", "Wedding & Events", "Interior Botanicals", "Decorative Vessels"]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  if (category === "All") return products
  return products.filter((p) => p.category === category)
}

export function getRelatedProducts(currentId: string, limit = 4): Product[] {
  const current = getProductById(currentId)
  if (!current) return products.slice(0, limit)

  const sameCategory = products.filter((p) => p.id !== currentId && p.category === current.category)
  const others = products.filter((p) => p.id !== currentId && p.category !== current.category)

  return [...sameCategory, ...others].slice(0, limit)
}
