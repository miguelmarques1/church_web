"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { LoadingState } from "@/components/common/loading-state"
import { EmptyState } from "@/components/common/empty-state"
import { ChatCard } from "@/components/common/chat-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  MoreVertical,
  Users,
  MessageCircle,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  ArrowLeft,
} from "lucide-react"
import { useChats } from "@/hooks/use-chat"
import { cn } from "@/lib/utils"
import type { Chat } from "@/types"

interface Message {
  id: number
  text: string
  timestamp: Date
  isOwn: boolean
  author?: string
}

const mockMessages: Message[] = [
  {
    id: 1,
    text: "Boa tarde, irmãos! Como estão?",
    timestamp: new Date(2025, 4, 25, 14, 30),
    isOwn: false,
    author: "João Silva",
  },
  {
    id: 2,
    text: "Oi João! Tudo bem por aqui, graças a Deus!",
    timestamp: new Date(2025, 4, 25, 14, 32),
    isOwn: true,
  },
  {
    id: 3,
    text: "Que bom! Vocês viram o cronograma do retiro espiritual?",
    timestamp: new Date(2025, 4, 25, 14, 35),
    isOwn: false,
    author: "João Silva",
  },
  {
    id: 4,
    text: "Sim! Está muito bom. Mal posso esperar 🙏",
    timestamp: new Date(2025, 4, 25, 14, 36),
    isOwn: true,
  },
  {
    id: 5,
    text: "Vamos nos reunir para orar antes da viagem?",
    timestamp: new Date(2025, 4, 25, 14, 40),
    isOwn: false,
    author: "Maria Santos",
  },
]

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [messageText, setMessageText] = useState("")
  const [showChatView, setShowChatView] = useState(false)
  const { chats, loading, error } = useChats()

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "unread" && chat.unread_count > 0) ||
      (selectedFilter === "groups" && chat.is_group)

    return matchesSearch && matchesFilter
  })

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  const formatMessageTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return formatTime(date)
    }
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
  }

  const sendMessage = () => {
    if (messageText.trim()) {
      console.log("Sending message:", messageText)
      setMessageText("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const selectChat = (chat: Chat) => {
    setSelectedChat(chat)
    setShowChatView(true)
  }

  const backToList = () => {
    setShowChatView(false)
    setSelectedChat(null)
  }

  const filters = [
    { id: "all", label: "Todas", count: chats.length },
    { id: "unread", label: "Não lidas", count: chats.filter((c) => c.unread_count > 0).length },
    { id: "groups", label: "Grupos", count: chats.filter((c) => c.is_group).length },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex-1">
          <Header title="Conversas" />
          <LoadingState message="Carregando conversas..." />
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1">
        <Header
          title={showChatView && selectedChat ? selectedChat.name : "Conversas"}
        />

        <main className="h-[calc(100vh-64px)] md:h-[calc(100vh-64px)]">
          {/* Desktop Layout - Two Columns */}
          <div className="hidden md:flex h-full">
            {/* Chat List */}
            <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
              {/* Search and Filters */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Pesquisar conversas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-50 border-0"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                        selectedFilter === filter.id
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                      )}
                    >
                      {filter.label}
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded-full text-xs",
                          selectedFilter === filter.id
                            ? "bg-white bg-opacity-20 text-white"
                            : "bg-gray-200 text-gray-600",
                        )}
                      >
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat List */}
              <div className="flex-1 overflow-y-auto">
                {filteredChats.length === 0 ? (
                  <EmptyState
                    icon={MessageCircle}
                    title="Nenhuma conversa encontrada"
                    description="Tente ajustar sua pesquisa."
                  />
                ) : (
                  <div className="p-2 space-y-2">
                    {filteredChats.map((chat) => (
                      <ChatCard
                        key={chat.id}
                        chat={chat}
                        onClick={() => selectChat(chat)}
                        isSelected={selectedChat?.id === chat.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedChat.image_url || "/placeholder.svg"} />
                        <AvatarFallback>
                          {selectedChat.is_group ? <Users className="h-5 w-5" /> : selectedChat.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-medium text-gray-900">{selectedChat.name}</h2>
                        <p className="text-sm text-gray-500">{selectedChat.is_group ? "12 participantes" : "online"}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {mockMessages.map((message) => (
                      <div key={message.id} className={cn("flex", message.isOwn ? "justify-end" : "justify-start")}>
                        <div
                          className={cn(
                            "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                            message.isOwn ? "bg-red-600 text-white" : "bg-white text-gray-900 shadow-sm",
                          )}
                        >
                          {!message.isOwn && message.author && (
                            <p className="text-xs font-medium text-red-600 mb-1">{message.author}</p>
                          )}
                          <p className="text-sm">{message.text}</p>
                          <p className={cn("text-xs mt-1", message.isOwn ? "text-red-100" : "text-gray-500")}>
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="bg-white border-t border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>

                      <div className="flex-1 relative">
                        <Input
                          placeholder="Digite uma mensagem"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2"
                        >
                          <Smile className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        onClick={sendMessage}
                        disabled={!messageText.trim()}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                /* Welcome Screen */
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-32 h-32 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-16 w-16 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Chat da Igreja</h2>
                    <p className="text-gray-600 mb-2">
                      Conecte-se com outros membros da igreja através de mensagens instantâneas.
                    </p>
                    <p className="text-sm text-gray-500">Selecione uma conversa para começar a conversar.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden h-full">
            {!showChatView ? (
              /* Chat List Mobile */
              <div className="h-full bg-white flex flex-col">
                {/* Search and Filters */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Pesquisar conversas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-50 border-0"
                    />
                  </div>

                  <div className="flex gap-2 overflow-x-auto">
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setSelectedFilter(filter.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                          selectedFilter === filter.id
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                        )}
                      >
                        {filter.label}
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded-full text-xs",
                            selectedFilter === filter.id
                              ? "bg-white bg-opacity-20 text-white"
                              : "bg-gray-200 text-gray-600",
                          )}
                        >
                          {filter.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto pb-20">
                  {filteredChats.length === 0 ? (
                    <EmptyState
                      icon={MessageCircle}
                      title="Nenhuma conversa encontrada"
                      description="Tente ajustar sua pesquisa."
                    />
                  ) : (
                    <div className="p-3 space-y-3">
                      {filteredChats.map((chat) => (
                        <ChatCard key={chat.id} chat={chat} onClick={() => selectChat(chat)} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Chat View Mobile */
              <div className="h-full flex flex-col bg-white">
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
                  <Button variant="ghost" size="sm" onClick={backToList}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedChat?.image_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedChat?.is_group ? <Users className="h-5 w-5" /> : selectedChat?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="font-medium text-gray-900">{selectedChat?.name}</h2>
                    <p className="text-sm text-gray-500">{selectedChat?.is_group ? "12 participantes" : "online"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {mockMessages.map((message) => (
                    <div key={message.id} className={cn("flex", message.isOwn ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-xs px-4 py-2 rounded-lg",
                          message.isOwn ? "bg-red-600 text-white" : "bg-white text-gray-900 shadow-sm",
                        )}
                      >
                        {!message.isOwn && message.author && (
                          <p className="text-xs font-medium text-red-600 mb-1">{message.author}</p>
                        )}
                        <p className="text-sm">{message.text}</p>
                        <p className={cn("text-xs mt-1", message.isOwn ? "text-red-100" : "text-gray-500")}>
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>

                    <div className="flex-1 relative">
                      <Input
                        placeholder="Digite uma mensagem"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pr-10"
                      />
                      <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      onClick={sendMessage}
                      disabled={!messageText.trim()}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
