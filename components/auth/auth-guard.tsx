"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { authService } from "@/lib/auth/auth-service"
import type { User } from "@/types/auth"
import { publicPages, requiresLogin } from "@/lib/auth/permissions"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)

        // Check if current page requires authentication
        const isPublicPage = publicPages.some((page) => pathname === page || pathname.startsWith(`${page}/`))
        const needsAuth = requiresLogin.some((page) => pathname.startsWith(page))

        // If page requires auth and user is not logged in, show modal instead of redirect
        if (!isPublicPage && !currentUser) {
          if (needsAuth || pathname.includes("/create") || pathname.includes("/edit")) {
            // Don't redirect, let the page handle showing login modal
            console.log("Page requires authentication, user should see login modal")
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
