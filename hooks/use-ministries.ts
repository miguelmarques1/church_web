"use client"

import { useState, useEffect } from "react"
import { ministryRepository } from "@/lib/repositories/ministry-repository"
import { toast } from "sonner"
import type { Ministry } from "@/types"
import { useRouter } from "next/navigation"

export function useMinistries() {
  const [ministries, setMinistries] = useState<Ministry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const loadMinistries = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ministryRepository.getAll()
      setMinistries(data)
    } catch (err) {
      console.error("Error loading ministries:", err)
      setError("Erro ao carregar ministérios")
      toast.error("Erro ao carregar ministérios")
    } finally {
      setLoading(false)
    }
  }

  const createMinistry = async (data: { name: string }) => {
    try {
      setLoading(true)
      setError(null)
      const newMinistry = await ministryRepository.create(data)
      setMinistries((prev) => [...prev, newMinistry])
      toast.success("Ministério criado com sucesso!")
      router.push("/ministries")
      return newMinistry
    } catch (err) {
      console.error("Error creating ministry:", err)
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar ministério"
      setError(errorMessage)
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMinistries()
  }, [])

  return {
    ministries,
    loading,
    error,
    loadMinistries,
    createMinistry,
  }
}
