import { api } from "@/lib/api"
import { PrayerRequest } from "@/types"

class PrayerRequestRepository {
  async getAll(): Promise<PrayerRequest[]> {
    try {
      const response = await api.get("/prayer-requests")
      return response.data
    } catch (error) {
      console.error("Failed to fetch prayer requests:", error)
      return []
    }
  }

  async getById(id: number): Promise<PrayerRequest | null> {
    try {
      const response = await api.get(`/prayer-requests/${id}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch prayer request with id ${id}:`, error)
      return null
    }
  }

  async create(prayerRequest: Omit<PrayerRequest, "id">): Promise<PrayerRequest> {
    const response = await api.post("/prayer-requests", prayerRequest)
    return response.data
  }

  async update(id: number, prayerRequest: Partial<PrayerRequest>): Promise<PrayerRequest | null> {
    try {
      const response = await api.put(`/prayer-requests/${id}`, prayerRequest)
      return response.data
    } catch (error) {
      console.error(`Failed to update prayer request with id ${id}:`, error)
      return null
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await api.delete(`/prayer-requests/${id}`)
      return true
    } catch (error) {
      console.error(`Failed to delete prayer request with id ${id}:`, error)
      return false
    }
  }

  async getActive(): Promise<PrayerRequest[]> {
    try {
      const response = await api.get("/prayer-requests/active")
      return response.data
    } catch (error) {
      console.error("Failed to fetch active prayer requests:", error)
      return []
    }
  }

  async markAsAnswered(id: number): Promise<boolean> {
    try {
      await api.put(`/prayer-requests/${id}/answer`, { answered: true })
      return true
    } catch (error) {
      console.error(`Failed to mark prayer request ${id} as answered:`, error)
      return false
    }
  }

  async incrementPrayCount(id: number): Promise<boolean> {
    try {
      await api.put(`/prayer-requests/${id}/pray`)
      return true
    } catch (error) {
      console.error(`Failed to increment pray count for request ${id}:`, error)
      return false
    }
  }
}

export const prayerRequestRepository = new PrayerRequestRepository()
