"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { PageHeader } from "@/components/common/page-header"
import { LoadingState } from "@/components/common/loading-state"
import { EmptyState } from "@/components/common/empty-state"
import { NewsCard } from "@/components/common/news-card"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { useNews } from "@/hooks/use-news"
import { useAuth } from "@/components/auth/auth-provider"
import type { News } from "@/types"

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all")
  const { news, loading, deleteNews } = useNews()
  const { role } = useAuth()

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta novidade?")) return
    await deleteNews(id)
  }

  // Filter news based on search term and filter type
  const filteredNews = news.filter((item: News) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "all") return matchesSearch
    if (filter === "published") return matchesSearch && item.featured
    if (filter === "draft") return matchesSearch && !item.featured

    return matchesSearch
  })

  // Count news by status
  const publishedCount = news.filter((item: News) => item.featured).length
  const draftCount = news.filter((item: News) => !item.featured).length

  // Check if user can see drafts (only leaders, pastors, admins)
  const canSeeDrafts = role === "leader" || role === "pastor" || role === "admin"

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Novidades" />

      <main className="p-4 pb-24">
        <PageHeader
          title="Novidades da Igreja"
          searchPlaceholder="Buscar novidade..."
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          createButton={{
            label: "Nova Novidade",
            href: "/news/create",
          }}
        />

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Badge
            variant={filter === "all" ? "default" : "outline"}
            className={filter === "all" ? "bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer" : "cursor-pointer"}
            onClick={() => setFilter("all")}
          >
            Todas ({news.length})
          </Badge>

          {canSeeDrafts && (
            <>
              <Badge
                variant={filter === "published" ? "default" : "outline"}
                className={
                  filter === "published" ? "bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer" : "cursor-pointer"
                }
                onClick={() => setFilter("published")}
              >
                Publicadas ({publishedCount})
              </Badge>

              <Badge
                variant={filter === "draft" ? "default" : "outline"}
                className={
                  filter === "draft" ? "bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer" : "cursor-pointer"
                }
                onClick={() => setFilter("draft")}
              >
                Rascunhos ({draftCount})
              </Badge>
            </>
          )}
        </div>

        {loading && <LoadingState message="Carregando novidades..." />}

        {!loading && (
          <div className="space-y-4">
            {filteredNews.map((newsItem: News) => (
              <NewsCard key={`${newsItem.id}-mobile`} news={newsItem} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {!loading && filteredNews.length === 0 && (
          <EmptyState
            icon={Search}
            title="Nenhuma novidade encontrada"
            description="Tente ajustar sua busca ou aguarde novas publicações."
            action={{
              label: "Compartilhar Novidade",
              href: "/news/create",
            }}
          />
        )}
      </main>

      <BottomNav />
    </div>
  )
}
