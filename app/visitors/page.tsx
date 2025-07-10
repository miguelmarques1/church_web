"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { PageHeader } from "@/components/common/page-header"
import { LoadingState } from "@/components/common/loading-state"
import { EmptyState } from "@/components/common/empty-state"
import { VisitorCard } from "@/components/common/visitor-card"
import { UserPlus } from "lucide-react"
import { useVisitors } from "@/hooks/use-visitors"

export default function VisitorsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const { visitors, loading, error } = useVisitors()

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "primeira" && visitor.status === "Primeira visita") ||
      (selectedFilter === "retornando" && visitor.status === "Retornando") ||
      (selectedFilter === "interessado" && visitor.status === "Interessado")

    return matchesSearch && matchesFilter
  })

  const filters = [
    { id: "all", label: "Todos", count: visitors.length },
    { id: "primeira", label: "Primeira visita", count: visitors.filter((v) => v.status === "Primeira visita").length },
    { id: "retornando", label: "Retornando", count: visitors.filter((v) => v.status === "Retornando").length },
    { id: "interessado", label: "Interessados", count: visitors.filter((v) => v.status === "Interessado").length },
  ]

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 flex">
          <div className="flex-1 flex flex-col">
            <Header title="Visitantes" />
            <LoadingState message="Carregando visitantes..." />
          </div>
          <BottomNav />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1 flex flex-col">
          <Header title="Visitantes" />

          <main className="p-4 pb-20 md:pb-4">
            <PageHeader
              title="Visitantes"
              searchPlaceholder="Buscar visitante..."
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              createButton={{
                label: "Adicionar",
                href: "/visitors/create",
              }}
            />

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedFilter === filter.id
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-xs ${
                      selectedFilter === filter.id ? "bg-white bg-opacity-20 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Visitors List */}
            {filteredVisitors.length === 0 ? (
              <EmptyState
                icon={UserPlus}
                title="Nenhum visitante encontrado"
                description="Tente ajustar sua pesquisa ou adicione um novo visitante."
                action={{
                  label: "Adicionar Visitante",
                  href: "/visitors/create",
                }}
              />
            ) : (
              <div className="space-y-3">
                {filteredVisitors.map((visitor) => (
                  <VisitorCard key={visitor.id} visitor={visitor} href={`/visitors/${visitor.id}`} />
                ))}
              </div>
            )}
          </main>
        </div>

        <BottomNav />
      </div>
    </AuthGuard>
  )
}
