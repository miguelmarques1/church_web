import { restClient } from "@/lib/api/rest-client"
import type { Family } from "@/types/index"

interface CreateFamilyRequest {
  name: string
  phone?: string
  address?: string
  receive_support: boolean
}

class FamilyRepository {
  async getAll(): Promise<Family[]> {
    try {
      const response = await restClient.get<{ data: Family[]; error: boolean; message: string | null }>("/families")

      if (response.data && !response.data.error) {
        return response.data.data
      }

      throw new Error(response.data?.message || "Failed to fetch families")
    } catch (error) {
      console.error("Error fetching families:", error)
      throw error
    }
  }

  async getById(id: number): Promise<Family> {
    try {
      const response = await restClient.get<{ data: Family; error: boolean; message: string | null }>(`/families/${id}`)

      if (response.data && !response.data.error) {
        return response.data.data
      }

      throw new Error(response.data?.message || "Failed to fetch family")
    } catch (error) {
      console.error("Error fetching family:", error)
      throw error
    }
  }

  async create(familyData: CreateFamilyRequest): Promise<Family> {
    try {
      const response = await restClient.post<{ data: Family; error: boolean; message: string | null }>(
        "/families",
        familyData,
      )

      if (response.data && !response.data.error) {
        return response.data.data
      }

      throw new Error(response.data?.message || "Failed to create family")
    } catch (error) {
      console.error("Error creating family:", error)
      throw error
    }
  }

  async update(id: number, familyData: Partial<CreateFamilyRequest>): Promise<Family> {
    try {
      const response = await restClient.put<{ data: Family; error: boolean; message: string | null }>(
        `/families/${id}`,
        familyData,
      )

      if (response.data && !response.data.error) {
        return response.data.data
      }

      throw new Error(response.data?.message || "Failed to update family")
    } catch (error) {
      console.error("Error updating family:", error)
      throw error
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await restClient.delete<{ error: boolean; message: string | null }>(`/families/${id}`)

      if (response.data && response.data.error) {
        throw new Error(response.data.message || "Failed to delete family")
      }
    } catch (error) {
      console.error("Error deleting family:", error)
      throw error
    }
  }
}

export const familyRepository = new FamilyRepository()
export type { CreateFamilyRequest }
