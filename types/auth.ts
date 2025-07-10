export interface LoginRequest {
  phone: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface User {
  id: number
  name: string
  phone: string
  email?: string
  imageUrl?: string | null
  role: {
    id: number
    name: string
    credentials: string
  }
  gender?: string
  family?: {
    id: number
    name: string
    receive_support: boolean
    phone: string
    address: string
  }
  birthdate?: string
  ministries?: any[]
}

export type UserRole = "member" | "leader" | "pastor" | "admin"
