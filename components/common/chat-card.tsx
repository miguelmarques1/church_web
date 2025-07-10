"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Chat } from "@/types"

interface ChatCardProps {
  chat: Chat
  onClick?: () => void
  isSelected?: boolean
}

export function ChatCard({ chat, onClick, isSelected }: ChatCardProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm",
        isSelected && "bg-red-50 border-l-4 border-l-red-500",
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={chat.image_url || "/placeholder.svg"} />
            <AvatarFallback>
              {chat.is_group ? <Users className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className={cn("font-medium truncate", chat.unread_count > 0 ? "text-gray-900" : "text-gray-700")}>
                {chat.name}
              </h3>
              {chat.last_message_timestamp && (
                <span className={cn("text-xs", chat.unread_count > 0 ? "text-red-600 font-medium" : "text-gray-500")}>
                  {formatTime(chat.last_message_timestamp)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              {chat.last_message && (
                <p
                  className={cn(
                    "text-sm truncate flex-1",
                    chat.unread_count > 0 ? "text-gray-900 font-medium" : "text-gray-600",
                  )}
                >
                  {chat.last_message}
                </p>
              )}

              {chat.unread_count > 0 && (
                <Badge className="bg-red-600 hover:bg-red-700 text-white ml-2 min-w-[20px] h-5 text-xs">
                  {chat.unread_count > 99 ? "99+" : chat.unread_count}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
