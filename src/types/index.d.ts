export type SiteConfig = {
  name: string;
  title: string;
  description: string;
  origin: string;
  og: string;
  keywords: string[];
  creator: {
    name: string;
    url: string;
  }
  socials: {
    github: string;
    x: string;
  }
}


export interface FormData {
  type: string
  duration: string
  distance: string
  calories: string
  date: string
}

export interface Statistics {
  totalCalories: number
  totalDistance: number
  totalDuration: number
  totalActivities: number
}

export interface UserType {
    id: string
    name: string
    email: string
    emailVerified: boolean
    createdAt: Date
    updatedAt: Date
    image?: string | null | undefined
}

type Product = {
  id: string
  title: string
  price?: number
  description?: string
  image?: string
  category?: CategoriesEnum
  quantity?: number
  createdAt?: string
  updadtedAt?: string
}

export enum CategoriesEnum {
  default = 'default',
  lighting = 'lighting',
  furniture = 'furniture',
  bags = 'bags',
  alphazero='alphazero'
}
