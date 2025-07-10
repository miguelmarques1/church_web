import { restClient } from "@/lib/api/rest-client"
import type { Role } from "@/types/index"

class RoleRepository {
  async getAll(): Promise<Role[]> {
    try {
      const response = await restClient.get<{ data: Role[]; error: boolean; message: string | null }>("/roles")

      if (response.data && !response.data.error) {
        return response.data.data
      }

      throw new Error(response.data?.message || "Failed to fetch roles")
    } catch (error) {
      console.error("Error fetching roles:", error)
      throw error
    }
  }

  async getById(id: number): Promise<Role> {
    try {
      const response = await restClient.get<{ data: Role; error: boolean; message: string | null }>(`/roles/${id}`)

      if (response.data && !response.data.error) {
        return response.data.data
      }

      throw new Error(response.data?.message || "Failed to fetch role")
    } catch (error) {
      console.error("Error fetching role:", error)
      throw error
    }
  }
}

export const roleRepository = new RoleRepository()
