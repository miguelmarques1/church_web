"use client"

import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"

// Mock visitor interface since we don't have a real API yet
interface Visitor {
  id: number
  name: string
  phone: string
  visitDate: string
  status: "Primeira visita" | "Retornando" | "Interessado"
  invitedBy: string
}

// Mock data for visitors (will be replaced with real API)
const mockVisitors: Visitor[] = [
  {
    id: 1,
    name: "Ana Costa",
    phone: "(11) 99999-1111",
    visitDate: "2025-05-25",
    status: "Primeira visita",
    invitedBy: "João Silva",
  },
  {
    id: 2,
    name: "Carlos Mendes",
    phone: "(11) 99999-2222",
    visitDate: "2025-05-20",
    status: "Retornando",
    invitedBy: "Maria Oliveira",
  },
  {
    id: 3,
    name: "Fernanda Lima",
    phone: "(11) 99999-3333",
    visitDate: "2025-05-15",
    status: "Interessado",
    invitedBy: "Pedro Santos",
  },
]

export function useVisitors() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setVisitors(mockVisitors)
      } catch (err) {
        setError("Erro ao carregar visitantes")
        toast({
          title: "Erro",
          description: "Não foi possível carregar os visitantes",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchVisitors()
  }, [])

  return { visitors, loading, error, refetch: () => {} }
}

export type { Visitor }
