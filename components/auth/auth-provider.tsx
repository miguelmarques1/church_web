"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "@/lib/auth/auth-service"
import type { User } from "@/types/auth"
import { LoginModal } from "@/components/auth/login-modal"

interface AuthContextType {
  user: User | null
  role: string | null
  isAuthenticated: boolean
  isLoading: boolean
  showLoginModal: boolean
  login: () => void
  logout: () => Promise<void>
  closeLoginModal: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  showLoginModal: false,
  login: () => {},
  logout: async () => {},
  closeLoginModal: () => {},
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginAttemptCount, setLoginAttemptCount] = useState(0)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const currentUser = await authService.getCurrentUser()

        if (currentUser) {
          setUser(currentUser)
          // Extract role credentials from the user object
          const roleCredential = currentUser.role?.credentials || null
          setRole(roleCredential)
          console.log("Auth Provider - User Role:", roleCredential)
        } else {
          setUser(null)
          setRole(null)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setUser(null)
        setRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [loginAttemptCount])

  const login = () => {
    setShowLoginModal(true)
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      setRole(null)
      // Refresh login attempt count to trigger useEffect
      setLoginAttemptCount((prev) => prev + 1)
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const closeLoginModal = () => {
    setShowLoginModal(false)
  }

  const handleLoginSuccess = () => {
    setShowLoginModal(false)
    // Refresh login attempt count to trigger useEffect
    setLoginAttemptCount((prev) => prev + 1)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        showLoginModal,
        login,
        logout,
        closeLoginModal,
      }}
    >
      {children}
      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} onLoginSuccess={handleLoginSuccess} />
    </AuthContext.Provider>
  )
}
