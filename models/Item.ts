import mongoose, { Schema, Document, Model } from "mongoose"
import { CollectionType } from "@/types/item"

export interface IItem extends Document {
  title: string
  slug: string
  description: string
  images: string[]
  category: CollectionType
  price?: number
  dimensions?: string
  material?: string
  createdAt: Date
  updatedAt: Date
}

const ItemSchema = new Schema<IItem>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "artificial-flowers",
        "artificial-green-plants",
        "bonsai",
        "hanging-greenery",
        "decor-accessories",
      ],
    },
    price: {
      type: Number,
    },
    dimensions: {
      type: String,
    },
    material: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// Auto-generate slug from title
ItemSchema.pre("save", function (next) {
  if (this.isModified("title") || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
  next()
})

export const Item: Model<IItem> =
  mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema)
