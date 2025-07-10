"use client"

import { useState, useEffect } from "react"
import { prayerRequestRepository } from "@/lib/repositories/prayer-request-repository"
import { toast } from "sonner"
import type { PrayerRequest } from "@/types"

export function usePrayerRequests() {
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPrayerRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await prayerRequestRepository.getAll()
      setPrayerRequests(data)
    } catch (err) {
      console.error("Error loading prayer requests:", err)
      setError("Erro ao carregar pedidos de oração")
      toast.error("Erro ao carregar pedidos de oração")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPrayerRequests()
  }, [])

  return {
    prayerRequests,
    loading,
    error,
    loadPrayerRequests,
  }
}
