import type React from "react"
// Consolidated types file - removing duplication

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export enum RoleCredentials {
  MEMBER = "member",
  LEADER = "leader",
  PASTOR = "pastor",
  ADMIN = "admin",
}

// Base interfaces matching API responses
export interface Role {
  id: number
  name: string
  credentials: RoleCredentials
}

export interface Family {
  id: number
  name: string
  phone?: string
  address?: string
  receive_support: boolean
  created_at?: Date
  member_count?: number
}

export interface Ministry {
  id: number
  name: string
  description?: string
  leader?: string
  members_count?: number
}

export interface Member {
  id: number
  name: string
  birthdate?: Date
  gender: Gender
  phone: string
  role: Role
  email?: string
  image_url?: string
  ministries?: Ministry[]
  family?: Family
  created_at?: Date
}

export interface Event {
  id: number
  title: string
  description?: string
  date: Date
  time?: string
  location: string
  image_url?: string
  recurring?: boolean
  organizer?: Member | null
  category?: string
  attendees?: number
  end_date: Date,
  recurrence_pattern?: string
  created_at?: Date
}

export interface News {
  id: number
  title: string
  excerpt?: string
  content?: string
  image_url?: string
  created_at: Date
  author?: string
  category?: string
  published?: boolean
  views?: number
}

export interface Devotional {
  id: number
  title: string
  verse_text: string
  content: string
  reference: string
  publication_date: Date
  image_url?: string
  author?: Member | null
  published?: boolean
  created_at?: Date
}

export interface PrayerRequest {
  id: number
  description: string
  title?: string
  author: Member
  praying_count: number
  created_at: Date
  is_public?: boolean
}

export interface Chat {
  id: number
  name: string
  image_url?: string
  last_message?: string
  last_message_timestamp?: Date
  unread_count: number
  is_group: boolean
}

// Auth types
export interface User {
  id: number
  name: string
  email?: string
  phone: string
  role: Role
  image_url?: string
}

export interface AuthResponse {
  access_token: string
  user: User
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T
  error: boolean
  message: string | null
}

// Common component props
export interface LoadingStateProps {
  message?: string
}

export interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
}

export interface PageHeaderProps {
  title: string
  searchPlaceholder: string
  searchValue: string
  onSearchChange: (value: string) => void
  createButton?: {
    label: string
    href: string
  }
}

export interface StatsCardProps {
  title: string
  value: number | string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
}