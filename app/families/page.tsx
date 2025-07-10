"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { PageHeader } from "@/components/common/page-header"
import { LoadingState } from "@/components/common/loading-state"
import { EmptyState } from "@/components/common/empty-state"
import { FamilyCard } from "@/components/common/family-card"
import { Search } from "lucide-react"
import { familyRepository } from "@/lib/repositories/family-repository"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { Family } from "@/types"

export default function FamiliesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [families, setFamilies] = useState<Family[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      login()
      return
    }
    loadFamilies()
  }, [isAuthenticated, login])

  const loadFamilies = async () => {
    try {
      setLoading(true)
      const data = await familyRepository.getAll()
      setFamilies(data)
    } catch (error) {
      console.error("Error loading families:", error)
      toast.error("Erro ao carregar famílias")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1 flex flex-col">
          <Header title="Famílias"/>
          <main className="p-4 flex items-center justify-center h-[80vh]">
            <EmptyState
              icon={Search}
              title="Área Restrita"
              description="Entre para conhecer as famílias de nossa comunidade"
              action={{
                label: "Entrar",
                href: "/login",
              }}
            />
          </main>
        </div>
      </div>
    )
  }

  const filteredFamilies = families.filter((family) => family.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col">
        <Header title="Famílias" />

        <main className="p-4 pb-20 md:pb-4">
          <PageHeader
            title="Famílias de Nossa Comunidade"
            searchPlaceholder="Buscar família..."
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            createButton={{
              label: "Nova Família",
              href: "/families/create",
            }}
          />

          {loading && <LoadingState message="Carregando famílias..." />}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFamilies.map((family) => (
                <FamilyCard key={family.id} family={family} href={`/families/${family.id}`} />
              ))}
            </div>
          )}

          {!loading && filteredFamilies.length === 0 && (
            <EmptyState
              icon={Search}
              title="Nenhuma família encontrada"
              description="Tente ajustar sua busca ou registre uma nova família."
              action={{
                label: "Registrar Família",
                href: "/families/create",
              }}
            />
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
