import { restClient } from "@/lib/api/rest-client"
import type { News } from "@/types/index"

interface CreateNewsRequest {
  title: string
  content: string
  excerpt?: string
  image_url?: string
  category: string
  published?: boolean
}

class NewsRepository {
  async getAll(): Promise<News[]> {
    try {
      const response = await restClient.get<{ data: News[]; error: boolean; message: string | null }>("/news")

      if (response.data && !response.data.error) {
        return response.data.data.map((news) => ({
          ...news,
          createdAt: new Date(news.created_at),
        }))
      }

      throw new Error(response.data?.message || "Failed to fetch news")
    } catch (error) {
      console.error("Error fetching news:", error)
      throw error
    }
  }

  async getById(id: number): Promise<News> {
    try {
      const response = await restClient.get<{ data: News; error: boolean; message: string | null }>(`/news/${id}`)

      if (response.data && !response.data.error) {
        return {
          ...response.data.data,
          created_at: new Date(response.data.data.created_at),
        }
      }

      throw new Error(response.data?.message || "Failed to fetch news")
    } catch (error) {
      console.error("Error fetching news:", error)
      throw error
    }
  }

  async create(newsData: CreateNewsRequest): Promise<News> {
    try {
      const response = await restClient.post<{ data: News; error: boolean; message: string | null }>("/news", newsData)

      if (response.data && !response.data.error) {
        return {
          ...response.data.data,
          created_at: new Date(response.data.data.created_at),
        }
      }

      throw new Error(response.data?.message || "Failed to create news")
    } catch (error) {
      console.error("Error creating news:", error)
      throw error
    }
  }

  async update(id: number, newsData: Partial<CreateNewsRequest>): Promise<News> {
    try {
      const response = await restClient.put<{ data: News; error: boolean; message: string | null }>(
        `/news/${id}`,
        newsData,
      )

      if (response.data && !response.data.error) {
        return {
          ...response.data.data,
          created_at: new Date(response.data.data.created_at),
        }
      }

      throw new Error(response.data?.message || "Failed to update news")
    } catch (error) {
      console.error("Error updating news:", error)
      throw error
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await restClient.delete<{ error: boolean; message: string | null }>(`/news/${id}`)

      if (response.data && response.data.error) {
        throw new Error(response.data.message || "Failed to delete news")
      }
    } catch (error) {
      console.error("Error deleting news:", error)
      throw error
    }
  }

  async getPublished(): Promise<News[]> {
    try {
      const response = await restClient.get<{ data: News[]; error: boolean; message: string | null }>("/news/published")

      if (response.data && !response.data.error) {
        return response.data.data.map((news) => ({
          ...news,
          created_at: new Date(news.created_at),
        }))
      }

      throw new Error(response.data?.message || "Failed to fetch published news")
    } catch (error) {
      console.error("Error fetching published news:", error)
      throw error
    }
  }
}

export const newsRepository = new NewsRepository()
export type { CreateNewsRequest }
