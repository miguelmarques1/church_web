import { restClient } from "@/lib/api/rest-client"
import type { Devotional } from "@/types/index"

interface CreateDevotionalRequest {
  title: string
  verse_text: string
  content: string
  reference: string
  image_url?: string
  target_role_id?: number
}

interface DevotionalApiResponse {
  data: Devotional[]
  error: boolean
  message: string | null
}

interface SingleDevotionalApiResponse {
  data: Devotional
  error: boolean
  message: string | null
}

class DevotionalRepository {
  // Helper method to convert API response to internal format
  private mapDevotionalFromApi(apiDevotional: Devotional): Devotional {
    return {
      id: apiDevotional.id,
      title: apiDevotional.title,
      verse_text: apiDevotional.verse_text,
      content: apiDevotional.content,
      reference: apiDevotional.reference,
      publication_date: new Date(apiDevotional.publication_date),
      image_url: apiDevotional.image_url,
      author: apiDevotional.author || apiDevotional.author || null,
      published: apiDevotional.published,
    }
  }

  async getAll(): Promise<Devotional[]> {
    try {
      const response = await restClient.get<DevotionalApiResponse>("/devotionals")

      if (response.data && !response.data.error) {
        return response.data.data.map((devotional) => this.mapDevotionalFromApi(devotional))
      }

      throw new Error(response.data?.message || "Failed to fetch devotionals")
    } catch (error) {
      console.error("Error fetching devotionals:", error)
      throw error
    }
  }

  async getById(id: number): Promise<Devotional> {
    try {
      const response = await restClient.get<SingleDevotionalApiResponse>(`/devotionals/${id}`)

      if (response.data && !response.data.error) {
        return this.mapDevotionalFromApi(response.data.data)
      }

      throw new Error(response.data?.message || "Failed to fetch devotional")
    } catch (error) {
      console.error("Error fetching devotional:", error)
      throw error
    }
  }

  async create(devotionalData: CreateDevotionalRequest): Promise<Devotional> {
    try {
      const response = await restClient.post<SingleDevotionalApiResponse>("/devotionals", devotionalData)

      if (response.data && !response.data.error) {
        return this.mapDevotionalFromApi(response.data.data)
      }

      throw new Error(response.data?.message || "Failed to create devotional")
    } catch (error) {
      console.error("Error creating devotional:", error)
      throw error
    }
  }

  async update(id: number, devotionalData: Partial<CreateDevotionalRequest>): Promise<Devotional> {
    try {
      const response = await restClient.put<SingleDevotionalApiResponse>(`/devotionals/${id}`, devotionalData)

      if (response.data && !response.data.error) {
        return this.mapDevotionalFromApi(response.data.data)
      }

      throw new Error(response.data?.message || "Failed to update devotional")
    } catch (error) {
      console.error("Error updating devotional:", error)
      throw error
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await restClient.delete<{ error: boolean; message: string | null }>(`/devotionals/${id}`)

      if (response.data && response.data.error) {
        throw new Error(response.data.message || "Failed to delete devotional")
      }
    } catch (error) {
      console.error("Error deleting devotional:", error)
      throw error
    }
  }
}

export const devotionalRepository = new DevotionalRepository()
export type { CreateDevotionalRequest }
