// Types for Item model - safe for client components

export type CollectionType =
  | "artificial-flowers"
  | "artificial-green-plants"
  | "bonsai"
  | "hanging-greenery"
  | "decor-accessories"

export interface IItem {
  _id?: string
  title: string
  slug: string
  description: string
  images: string[]
  category: CollectionType
  price?: number
  dimensions?: string
  material?: string
  createdAt?: Date
  updatedAt?: Date
}

export const CATEGORIES: { value: CollectionType; label: string }[] = [
  { value: "artificial-flowers", label: "Artificial Flowers" },
  { value: "artificial-green-plants", label: "Artificial Green Plants" },
  { value: "bonsai", label: "Bonsai" },
  { value: "hanging-greenery", label: "Hanging Greenery" },
  { value: "decor-accessories", label: "Décor Accessories" },
]
