import { restClient } from "@/lib/api/rest-client"
import type { Ministry } from "@/types/index"

class MinistryRepository {
  async getAll(): Promise<Ministry[]> {
    try {
      const response = await restClient.get<{ data: Ministry[]; error: boolean; message: string | null }>("/ministries")

      if (response.data && !response.data.error) {
        return response.data.data
      }

      throw new Error(response.data?.message || "Failed to fetch ministries")
    } catch (error) {
      console.error("Error fetching ministries:", error)
      throw error
    }
  }

  async getById(id: number): Promise<Ministry> {
    try {
      const response = await restClient.get<{ data: Ministry; error: boolean; message: string | null }>(
        `/ministries/${id}`,
      )

      if (response.data && !response.data.error) {
        return response.data.data
      }

      throw new Error(response.data?.message || "Failed to fetch ministry")
    } catch (error) {
      console.error("Error fetching ministry:", error)
      throw error
    }
  }
}

export const ministryRepository = new MinistryRepository()
