import { restClient } from "@/lib/api/rest-client"
import type { Chat } from "@/types/index"

export interface SendMessageData {
  content: string
  chatId?: number
}

class ChatRepository {
  async getMessages(chatId?: number): Promise<Chat[]> {
    try {
      const endpoint = chatId ? `/chat/${chatId}/messages` : "/chat/messages"
      const response = await restClient.get<Chat[]>(endpoint)
      return response.data || []
    } catch (error) {
      console.error("Error fetching chat messages:", error)
      return []
    }
  }

  async sendMessage(data: SendMessageData): Promise<Chat | null> {
    try {
      const endpoint = data.chatId ? `/chat/${data.chatId}/messages` : "/chat/messages"
      const response = await restClient.post<Chat>(endpoint, {
        content: data.content,
      })
      return response.data || null
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }

  async getChats(): Promise<any[]> {
    try {
      const response = await restClient.get<any[]>("/chat")
      return response.data || []
    } catch (error) {
      console.error("Error fetching chats:", error)
      return []
    }
  }

  async createChat(name: string, memberIds: number[]): Promise<any | null> {
    try {
      const response = await restClient.post<any>("/chat", {
        name,
        memberIds,
      })
      return response.data || null
    } catch (error) {
      console.error("Error creating chat:", error)
      throw error
    }
  }
}

export const chatRepository = new ChatRepository()
