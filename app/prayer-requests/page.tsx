"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { PageHeader } from "@/components/common/page-header"
import { LoadingState } from "@/components/common/loading-state"
import { EmptyState } from "@/components/common/empty-state"
import { PrayerRequestCard } from "@/components/common/prayer-request-card"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"
import { usePrayerRequests } from "@/hooks/use-prayer-requests"

export default function PrayerRequestsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "public" | "private">("all")
  const { prayerRequests, loading } = usePrayerRequests()

  const filteredRequests = prayerRequests.filter((request) => {
    const matchesSearch =
      request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "all") return matchesSearch
    if (filter === "public") return matchesSearch && request.is_public
    if (filter === "private") return matchesSearch && !request.is_public

    return matchesSearch
  })

  const publicCount = prayerRequests.filter((request) => request.is_public).length
  const privateCount = prayerRequests.filter((request) => !request.is_public).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1">
        <Header title="Pedidos de Oração" />

        <main className="p-4 pb-20 md:pb-4">
          <PageHeader
            title="Pedidos de Oração"
            searchPlaceholder="Buscar pedido..."
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            createButton={{
              label: "Novo Pedido",
              href: "/prayer-requests/create",
            }}
          />

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            <Badge
              variant={filter === "all" ? "default" : "outline"}
              className={
                filter === "all" ? "bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer" : "cursor-pointer"
              }
              onClick={() => setFilter("all")}
            >
              Todos ({prayerRequests.length})
            </Badge>
            <Badge
              variant={filter === "public" ? "default" : "outline"}
              className={
                filter === "public"
                  ? "bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer"
                  : "cursor-pointer"
              }
              onClick={() => setFilter("public")}
            >
              Públicos ({publicCount})
            </Badge>
            <Badge
              variant={filter === "private" ? "default" : "outline"}
              className={
                filter === "private"
                  ? "bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer"
                  : "cursor-pointer"
              }
              onClick={() => setFilter("private")}
            >
              Privados ({privateCount})
            </Badge>
          </div>

          {loading && <LoadingState message="Carregando pedidos de oração..." />}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRequests.map((request) => (
                <PrayerRequestCard key={request.id} prayerRequest={request} href={`/prayer-requests/${request.id}`} />
              ))}
            </div>
          )}

          {!loading && filteredRequests.length === 0 && (
            <EmptyState
              icon={Heart}
              title="Nenhum pedido encontrado"
              description="Tente ajustar sua pesquisa ou crie um novo pedido de oração."
              action={{
                label: "Novo Pedido",
                href: "/prayer-requests/create",
              }}
            />
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
