"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { PageHeader } from "@/components/common/page-header"
import { LoadingState } from "@/components/common/loading-state"
import { EmptyState } from "@/components/common/empty-state"
import { MemberCard } from "@/components/common/member-card"
import { Search, Plus } from "lucide-react" // Import Plus icon
import { memberRepository } from "@/lib/repositories/member-repository"
import { useAuth } from "@/components/auth/auth-provider"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { Member } from "@/types"
import { Button } from "@/components/ui/button" // Import Button
import { ProtectedAction } from "@/components/auth/protected-action" // Import ProtectedAction
import Link from "next/link" // Import Link

export default function MembersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      loadMembers()
    }
  }, [isLoading, isAuthenticated])

  const loadMembers = async () => {
    try {
      setLoading(true)
      const data = await memberRepository.getAll(searchTerm)
      setMembers(data)
    } catch (error) {
      console.error("Error loading members:", error)
      toast.error("Erro ao carregar nossa família")
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1 flex flex-col">
          <Header title="Nossa Família" />
          <main className="p-4 flex items-center justify-center h-[80vh]">
            <LoadingState message="Carregando..." />
          </main>
        </div>
      </div>
    )
  }

  // If authentication check is complete and user is not authenticated
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1 flex flex-col">
          <Header title="Nossa Família" />
          <main className="p-4 flex items-center justify-center h-[80vh]">
            <EmptyState icon={Search} title="Área Restrita" description="Entre para conhecer nossa família na fé" />
          </main>
        </div>
        <BottomNav />
      </div>
    )
  }

  const filteredMembers = members.filter((member) => member.name?.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col">
        <Header title="Nossa Família" />

        <main className="p-4 pb-20 md:pb-4">
          <div className="flex items-center justify-between mb-4">
            <PageHeader
              title="Nossa Família na Fé"
              searchPlaceholder="Buscar irmão..."
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              // createButton prop removed here
            />
            <ProtectedAction resource="members" action="create">
              <Link href="/members/create" passHref>
                <Button className="ml-4">
                  <Plus className="mr-2 h-4 w-4" /> Novo Irmão
                </Button>
              </Link>
            </ProtectedAction>
          </div>

          {loading && <LoadingState message="Carregando nossa família..." />}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <MemberCard key={member.id} member={member} href={`/members/${member.id}`} />
              ))}
            </div>
          )}

          {!loading && filteredMembers.length === 0 && (
            <EmptyState
              icon={Search}
              title="Nenhum irmão encontrado"
              description="Tente ajustar sua busca ou convide alguém para nossa família."
              action={
                {
                  label: "Adicionar Irmão",
                  href: "/members/create",
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
