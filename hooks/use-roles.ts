"use client"

import { useState, useEffect, useCallback } from "react"
import type { Role } from "@/types"
import { roleRepository } from "@/lib/repositories/role-repository"
import { toast } from "@/hooks/use-toast"

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await roleRepository.getAll()
      setRoles(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar roles"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const getRoleById = useCallback(
    (id: number) => {
      return roles.find((role) => role.id === id)
    },
    [roles],
  )

  const getRoleByCredentials = useCallback(
    (credentials: string) => {
      return roles.find((role) => role.credentials === credentials)
    },
    [roles],
  )

  const getStats = useCallback(() => {
    return {
      total: roles.length,
      byCredentials: roles.reduce(
        (acc, role) => {
          acc[role.credentials] = (acc[role.credentials] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    }
  }, [roles])

  const refresh = useCallback(() => {
    loadRoles()
  }, [loadRoles])

  useEffect(() => {
    loadRoles()
  }, [loadRoles])

  return {
    roles,
    loading,
    error,
    getRoleById,
    getRoleByCredentials,
    getStats,
    refresh,
  }
}
