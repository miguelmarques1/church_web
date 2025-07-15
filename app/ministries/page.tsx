"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { PageHeader } from "@/components/common/page-header"
import { LoadingState } from "@/components/common/loading-state"
import { EmptyState } from "@/components/common/empty-state"
import { StatsCard } from "@/components/common/stats-card"
import { MinistryCard } from "@/components/common/ministry-card"
import { Users, PlusCircle } from "lucide-react" 
import { useMinistries } from "@/hooks/use-ministries"
import { Button } from "@/components/ui/button"
import Link from "next/link" 
import { ProtectedAction } from "@/components/auth/protected-action"

export default function MinistriesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { ministries, loading } = useMinistries()

  const filteredMinistries = ministries.filter((ministry) =>
    ministry.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalMembers = ministries.reduce((acc, ministry) => acc + (ministry.members_count || 0), 0)
  const averageMembers = ministries.length > 0 ? Math.round(totalMembers / ministries.length) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1">
        <Header title="Ministérios" />

        <main className="p-4 pb-20 md:pb-4">
          <div className="flex items-center justify-between mb-6">
            <PageHeader
              title="Ministérios"
              searchPlaceholder="Buscar ministério..."
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              // Removed createButton from PageHeader to use ProtectedAction separately
            />
            <ProtectedAction resource="ministries" action="create">
              <Link href="/ministries/create" passHref>
                <Button className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Adicionar
                </Button>
              </Link>
            </ProtectedAction>
          </div>

          {loading && <LoadingState message="Carregando ministérios..." />}

          {!loading && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatsCard title="Ministérios" value={ministries.length} />
                <StatsCard title="Membros Ativos" value={totalMembers} />
                <StatsCard title="Líderes" value={ministries.length} />
                <StatsCard title="Média/Ministério" value={averageMembers} />
              </div>

              {/* Ministries List */}
              <div className="space-y-3">
                {filteredMinistries.map((ministry) => (
                  <MinistryCard key={ministry.id} ministry={ministry} href={`/ministries/${ministry.id}`} />
                ))}
              </div>
            </>
          )}

          {!loading && filteredMinistries.length === 0 && (
            <EmptyState
              icon={Users}
              title="Nenhum ministério encontrado"
              description="Tente ajustar sua pesquisa ou adicione um novo ministério."
              action={
                {
                  label: "Adicionar Ministério",
                  href: "/ministries/create",
                }
              }
            />
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
