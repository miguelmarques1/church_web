import { restClient } from "@/lib/api/rest-client"

export interface UploadFileData {
  file: File
  category?: string
}

export interface FileUploadResponse {
  id: number
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  category?: string
}

class FileRepository {
  async upload(data: UploadFileData): Promise<FileUploadResponse | null> {
    try {
      const formData = new FormData()
      formData.append("file", data.file)
      if (data.category) {
        formData.append("category", data.category)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/files/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  }

  async getAll(): Promise<FileUploadResponse[]> {
    try {
      const response = await restClient.get<FileUploadResponse[]>("/files")
      return response.data || []
    } catch (error) {
      console.error("Error fetching files:", error)
      return []
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await restClient.delete(`/files/${id}`)
      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      return false
    }
  }
}

export const fileRepository = new FileRepository()
