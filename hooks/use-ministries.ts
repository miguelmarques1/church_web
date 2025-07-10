"use client"

import { useState, useEffect } from "react"
import { ministryRepository } from "@/lib/repositories/ministry-repository"
import { toast } from "sonner"
import type { Ministry } from "@/types"

export function useMinistries() {
  const [ministries, setMinistries] = useState<Ministry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    loadMinistries()
  }, [])

  return {
    ministries,
    loading,
    error,
    loadMinistries,
  }
}
