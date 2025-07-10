"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { ProtectedAction } from "@/components/auth/protected-action"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Calendar, User, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { devotionalRepository } from "@/lib/repositories/devotional-repository"
import { toast } from "sonner"
import type { Devotional } from "@/types/"

export default function DevotionalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [devotional, setDevotional] = useState<Devotional | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadDevotional(Number(params.id))
    }
  }, [params.id])

  const loadDevotional = async (id: number) => {
    try {
      setLoading(true)
      const data = await devotionalRepository.getById(id)
      setDevotional(data)
    } catch (error) {
      console.error("Error loading devotional:", error)
      toast.error("Erro ao carregar devocional")
      router.push("/devotionals")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!devotional || !confirm("Tem certeza que deseja excluir este devocional?")) return

    try {
      await devotionalRepository.delete(devotional.id)
      toast.success("Devocional excluído com sucesso")
      router.push("/devotionals")
    } catch (error) {
      console.error("Error deleting devotional:", error)
      toast.error("Erro ao excluir devocional")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Carregando..." />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <span className="ml-2 text-gray-600">Carregando devocional...</span>
        </div>
      </div>
    )
  }

  if (!devotional) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Devocional não encontrado" />
        <div className="text-center py-12">
          <p className="text-gray-600">Devocional não encontrado</p>
          <Button asChild className="mt-4">
            <Link href="/devotionals">Voltar aos Devocionais</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={devotional.title} />

      <main className="p-4 pb-20">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.push("/devotionals")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="flex gap-2">
            <ProtectedAction resource="devotionals" action="update">
              <Button variant="outline" asChild>
                <Link href={`/devotionals/${devotional.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Link>
              </Button>
            </ProtectedAction>

            <ProtectedAction resource="devotionals" action="delete">
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </ProtectedAction>
          </div>
        </div>

        {/* Devotional Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            {/* Hero Image */}
            {devotional.image_url && (
              <div className="relative h-64 md:h-80">
                <Image
                  src={devotional.image_url || "/placeholder.svg"}
                  alt={devotional.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h1 className="text-2xl md:text-3xl font-bold mb-3">{devotional.title}</h1>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4">
                    <p className="text-lg mb-2">"{devotional.verse_text}"</p>
                    <p className="text-sm opacity-90">{devotional.reference}</p>
                  </div>
                </div>
              </div>
            )}

            <CardContent className="p-6">
              {/* Title and Verse (if no image) */}
              {!devotional.image_url && (
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{devotional.title}</h1>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <p className="text-lg text-gray-800 mb-2">"{devotional.verse_text}"</p>
                    <p className="text-sm text-gray-600">{devotional.reference}</p>
                  </div>
                </div>
              )}

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {devotional.publication_date.toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>

                {devotional.author && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {devotional.author?.name}
                  </div>
                )}

                {!devotional.published && <Badge variant="secondary">Rascunho</Badge>}
              </div>

              {/* Content */}
              <div className="prose prose-gray max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{devotional.content}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
