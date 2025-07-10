"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { hasPermission } from "@/lib/auth/permissions"

interface ProtectedActionProps {
  resource: string
  action: "create" | "read" | "update" | "delete"
  children: ReactNode
  fallback?: ReactNode
}

export function ProtectedAction({ resource, action, children, fallback = null }: ProtectedActionProps) {
  const { role, isAuthenticated } = useAuth()

  // Se não estiver autenticado ou não tiver permissão, não mostra nada (ou mostra o fallback)
  if (!isAuthenticated || !hasPermission(role, resource, action)) {
    return fallback ? <>{fallback}</> : null
  }

  // Se estiver autenticado e tiver permissão, mostra o conteúdo
  return <>{children}</>
}
