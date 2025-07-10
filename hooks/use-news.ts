"use client"

import { useState, useEffect } from "react"
import { newsRepository } from "@/lib/repositories/news-repository"
import { toast } from "sonner"
import type { News } from "@/types"

export function useNews() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNews = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await newsRepository.getAll()
      setNews(data)
    } catch (err) {
      console.error("Error loading news:", err)
      setError("Erro ao carregar notícias")
      toast.error("Erro ao carregar notícias")
    } finally {
      setLoading(false)
    }
  }

  const deleteNews = async (id: number) => {
    try {
      await newsRepository.delete(id)
      setNews(news.filter((item) => item.id !== id))
      toast.success("Notícia excluída com sucesso")
    } catch (err) {
      console.error("Error deleting news:", err)
      toast.error("Erro ao excluir notícia")
    }
  }

  useEffect(() => {
    loadNews()
  }, [])

  return {
    news,
    loading,
    error,
    loadNews,
    deleteNews,
  }
}
