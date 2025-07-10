"use client"

import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import type { Chat } from "@/types"

// Mock data for chats (will be replaced with real API)
const mockChats: Chat[] = [
  {
    id: 1,
    name: "Grupo Geral",
    image_url: "/placeholder.svg?height=40&width=40",
    last_message: "Não temas, porque eu sou contigo; não te assombres...",
    last_message_timestamp: new Date("2024-01-15T10:00:00Z"),
    unread_count: 3,
    is_group: true,
  },
  {
    id: 2,
    name: "Ministério de Jovens",
    image_url: "/placeholder.svg?height=40&width=40",
    last_message: "Reunião hoje às 19h",
    last_message_timestamp: new Date("2024-01-15T09:00:00Z"),
    unread_count: 1,
    is_group: true,
  },
  {
    id: 3,
    name: "Líderes",
    image_url: "/placeholder.svg?height=40&width=40",
    last_message: "Vamos nos reunir para planejar o próximo evento",
    last_message_timestamp: new Date("2024-01-14T20:00:00Z"),
    unread_count: 0,
    is_group: true,
  },
  {
    id: 4,
    name: "João Silva",
    image_url: "/placeholder.svg?height=40&width=40",
    last_message: "Obrigado pela oração!",
    last_message_timestamp: new Date("2024-01-14T15:30:00Z"),
    unread_count: 2,
    is_group: false,
  },
]

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setChats(mockChats)
      } catch (err) {
        setError("Erro ao carregar conversas")
        toast({
          title: "Erro",
          description: "Não foi possível carregar as conversas",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchChats()
  }, [])

  return { chats, loading, error, refetch: () => {} }
}
