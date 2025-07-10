"use client"

import { useState, useEffect, useCallback } from "react"
import type { Family } from "@/types"
import { familyRepository } from "@/lib/repositories/family-repository"
import { toast } from "@/hooks/use-toast"

export function useFamilies() {
  const [families, setFamilies] = useState<Family[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const loadFamilies = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await familyRepository.getAll()
      setFamilies(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar famílias"
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

  const searchFamilies = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const filteredFamilies = useCallback(() => {
    if (!searchTerm) return families

    return families.filter(
      (family) =>
        family.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.address?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [families, searchTerm])

  const getFamilyById = useCallback(
    (id: number) => {
      return families.find((family) => family.id === id)
    },
    [families],
  )

  const getFamiliesBySupport = useCallback(
    (receiveSupport: boolean) => {
      return families.filter((family) => family.receive_support === receiveSupport)
    },
    [families],
  )

  const deleteFamily = useCallback(async (id: number) => {
    try {
      await familyRepository.delete(id)
      setFamilies((prev) => prev.filter((family) => family.id !== id))
      toast({
        title: "Sucesso",
        description: "Família excluída com sucesso",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir família"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }, [])

  const getStats = useCallback(() => {
    const supportFamilies = families.filter((f) => f.receive_support).length
    const totalMembers = families.reduce((sum, f) => sum + (f.member_count || 0), 0)

    return {
      total: families.length,
      withSupport: supportFamilies,
      withoutSupport: families.length - supportFamilies,
      totalMembers,
      averageMembersPerFamily: families.length > 0 ? Math.round((totalMembers / families.length) * 10) / 10 : 0,
    }
  }, [families])

  const refresh = useCallback(() => {
    loadFamilies()
  }, [loadFamilies])

  useEffect(() => {
    loadFamilies()
  }, [loadFamilies])

  return {
    families: filteredFamilies(),
    allFamilies: families,
    loading,
    error,
    searchTerm,
    searchFamilies,
    getFamilyById,
    getFamiliesBySupport,
    deleteFamily,
    getStats,
    refresh,
  }
}
