"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { PageHeader } from "@/components/common/page-header"
import { LoadingState } from "@/components/common/loading-state"
import { EmptyState } from "@/components/common/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, BookOpen, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { devotionalRepository } from "@/lib/repositories/devotional-repository"
import { ProtectedAction } from "@/components/auth/protected-action"
import { toast } from "sonner"
import type { Devotional } from "@/types"

export default function DevotionalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDevotionals()
  }, [])

  const loadDevotionals = async () => {
    try {
      setLoading(true)
      const data = await devotionalRepository.getAll()
      setDevotionals(data)
    } catch (error) {
      console.error("Error loading devotionals:", error)
      toast.error("Erro ao carregar devocionais")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este devocional?")) return

    try {
      await devotionalRepository.delete(id)
      setDevotionals(devotionals.filter((devotional) => devotional.id !== id))
      toast.success("Devocional excluído com sucesso")
    } catch (error) {
      console.error("Error deleting devotional:", error)
      toast.error("Erro ao excluir devocional")
    }
  }

  const filteredDevotionals = devotionals.filter((devotional) =>
    devotional.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Devocionais" />

      <main className="p-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <PageHeader
              title="Devocionais"
              searchPlaceholder="Buscar devocional..."
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
          <ProtectedAction resource="devotionals" action="create">
            <Button asChild className="ml-4">
              <Link href="/devotionals/create">Novo Devocional</Link>
            </Button>
          </ProtectedAction>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Badge variant="default" className="bg-red-100 text-red-800 hover:bg-red-200">
            Todos ({devotionals.length})
          </Badge>
          <Badge variant="outline">Publicados</Badge>
          <Badge variant="outline">Rascunhos</Badge>
        </div>

        {loading && <LoadingState message="Carregando devocionais..." />}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDevotionals.map((devotional) => (
              <Card key={devotional.id} className="hover:shadow-md transition-shadow overflow-hidden">
                <Link href={`/devotionals/${devotional.id}`}>
                  <div className="relative h-48">
                    <Image
                      src={devotional.image_url || "/placeholder.svg"}
                      alt={devotional.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40" />
                    {!devotional.published && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary">Rascunho</Badge>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <ProtectedAction resource="devotionals" action="update">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 bg-white bg-opacity-20 hover:bg-opacity-30"
                          asChild
                        >
                          <Link href={`/devotionals/${devotional.id}/edit`}>
                            <Edit className="h-4 w-4 text-white" />
                          </Link>
                        </Button>
                      </ProtectedAction>
                      <ProtectedAction resource="devotionals" action="delete">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 bg-white bg-opacity-20 hover:bg-opacity-30"
                          onClick={(e) => {
                            e.preventDefault()
                            handleDelete(devotional.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-white" />
                        </Button>
                      </ProtectedAction>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-xs opacity-90 mb-1">"{devotional.verse_text}"</p>
                      <p className="text-xs opacity-75">{devotional.reference}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{devotional.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{devotional.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(devotional.publication_date).toLocaleDateString("pt-BR")}
                      </div>
                      <span>por {devotional.author?.name || "Autor desconhecido"}</span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredDevotionals.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title="Nenhum devocional encontrado"
            description="Tente ajustar sua pesquisa ou crie um novo devocional."
            action={
              {
                label: "Criar Devocional",
                href: "/devotionals/create",
              } 
            }
          />
        )}
      </main>
    </div>
  )
}
