import { restClient } from "@/lib/api/rest-client"
import type { Member } from "@/types/index"

interface CreateMemberRequest {
  name: string
  birthdate?: string
  gender: "male" | "female"
  role_id: number
  phone: string
  email?: string
  image_url?: string
  family_id?: number
  ministries?: number[]
}

interface UpdateMemberRequest extends Partial<CreateMemberRequest> {
  id: number
}

class MemberRepository {
  async getAll(search?: string): Promise<Member[]> {
    try {
      const queryParams = search ? { search } : undefined
      const response = await restClient.get<{ data: Member[]; error: boolean; message: string | null }>(
        "/members",
        queryParams,
      )

      if (response.data && !response.data.error) {
        return response.data.data
      }

      throw new Error(response.data?.message || "Failed to fetch members")
    } catch (error) {
      console.error("Error fetching members:", error)
      throw error
    }
  }

  async getById(id: number): Promise<Member> {
    try {
      const response = await restClient.get<{ data: Member; error: boolean; message: string | null }>(`/members/${id}`)

      if (response.data && !response.data.error) {
        return response.data.data
      }

      throw new Error(response.data?.message || "Failed to fetch member")
    } catch (error) {
      console.error("Error fetching member:", error)
      throw error
    }
  }

  async create(memberData: CreateMemberRequest): Promise<Member> {
    try {
      const response = await restClient.post<{ data: Member; error: boolean; message: string | null }>(
        "/members",
        memberData,
      )

      if (response.data && !response.data.error) {
        return response.data.data
      }

      throw new Error(response.data?.message || "Failed to create member")
    } catch (error) {
      console.error("Error creating member:", error)
      throw error
    }
  }

  async update(id: number, memberData: Partial<CreateMemberRequest>): Promise<Member> {
    try {
      const response = await restClient.put<{ data: Member; error: boolean; message: string | null }>(
        `/members/${id}`,
        memberData,
      )

      if (response.data && !response.data.error) {
        return response.data.data
      }

      throw new Error(response.data?.message || "Failed to update member")
    } catch (error) {
      console.error("Error updating member:", error)
      throw error
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await restClient.delete<{ error: boolean; message: string | null }>(`/members/${id}`)

      if (response.data && response.data.error) {
        throw new Error(response.data.message || "Failed to delete member")
      }
    } catch (error) {
      console.error("Error deleting member:", error)
      throw error
    }
  }

  async getCurrentUser(): Promise<Member> {
    try {
      const response = await restClient.get<{ data: Member; error: boolean; message: string | null }>("/members/me")

      if (response.data && !response.data.error) {
        return response.data.data
      }

      throw new Error(response.data?.message || "Failed to fetch current user")
    } catch (error) {
      console.error("Error fetching current user:", error)
      throw error
    }
  }
}

export const memberRepository = new MemberRepository()
export type { CreateMemberRequest, UpdateMemberRequest }
