"use client"

import { useState, useCallback } from "react"
import type { Family } from "@/types"
import { familyRepository } from "@/lib/repositories/family-repository"
import { toast } from "@/hooks/use-toast"

interface CreateFamilyData {
  name: string
  phone?: string
  address?: string
  receive_support: boolean
}

interface UpdateFamilyData extends Partial<CreateFamilyData> {
  id: number
}

export function useFamily(initialId?: number) {
  const [family, setFamily] = useState<Family | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFamily = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await familyRepository.getById(id)
      setFamily(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar família"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createFamily = useCallback(async (data: CreateFamilyData) => {
    try {
      setLoading(true)
      setError(null)
      const newFamily = await familyRepository.create(data)
      setFamily(newFamily)
      toast({
        title: "Sucesso",
        description: "Família criada com sucesso",
      })
      return newFamily
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar família"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateFamily = useCallback(async (data: UpdateFamilyData) => {
    try {
      setLoading(true)
      setError(null)
      const updatedFamily = await familyRepository.update(data.id, data)
      setFamily(updatedFamily)
      toast({
        title: "Sucesso",
        description: "Família atualizada com sucesso",
      })
      return updatedFamily
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar família"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteFamily = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await familyRepository.delete(id)
      setFamily(null)
      toast({
        title: "Sucesso",
        description: "Família excluída com sucesso",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir família"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setFamily(null)
    setError(null)
  }, [])

  // Auto-load if initialId is provided
  useState(() => {
    if (initialId) {
      loadFamily(initialId)
    }
  })

  return {
    family,
    loading,
    error,
    loadFamily,
    createFamily,
    updateFamily,
    deleteFamily,
    reset,
  }
}
