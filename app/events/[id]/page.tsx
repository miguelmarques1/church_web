"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, ArrowLeft, Share2, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Event } from "@/types"
import { ProtectedAction } from "@/components/auth/protected-action"
import { toast } from "sonner"
import { useEvent } from "@/hooks/use-event"

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const {event, loading, error} = useEvent(Number(params.id))


  const handleDelete = () => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return

    // In a real app, this would be an API call
    toast.success("Evento excluído com sucesso")
    router.push("/calendar")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copiado para a área de transferência")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Carregando..." />
        <main className="p-4 flex items-center justify-center h-[80vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Evento não encontrado" />
        <main className="p-4 flex flex-col items-center justify-center h-[60vh]">
          <Calendar className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Evento não encontrado</h2>
          <p className="text-gray-600 mb-6">O evento que você está procurando não existe ou foi removido.</p>
          <Button asChild>
            <Link href="/calendar">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para a agenda
            </Link>
          </Button>
        </main>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const formattedDate = eventDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Detalhes do Evento" />

      <main className="p-4 pb-20">
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/calendar" className="text-gray-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para a agenda
            </Link>
          </Button>
        </div>

        {/* Event Header */}
        <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden mb-6">
          <Image
            src={event.image_url || "/placeholder.svg?height=300&width=800"}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-4 text-white">
              <Badge className="mb-2 bg-red-600 hover:bg-red-700">{event.category}</Badge>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{event.title}</h1>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Sobre o evento</h2>
                <p className="text-gray-700 mb-6">{event.description || "Nenhuma descrição disponível."}</p>

                {event.recurring && (
                  <div className="mb-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Evento recorrente ({event.recurrence_pattern})
                    </Badge>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Data</h3>
                      <p className="text-gray-600">{formattedDate}</p>
                      {event.end_date && (
                        <p className="text-gray-600">Até {new Date(event.end_date).toLocaleDateString("pt-BR")}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Horário</h3>
                      <p className="text-gray-600">{event.time || "Horário não definido"}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Local</h3>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>

                  {event.organizer && (
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Organizador</h3>
                        <p className="text-gray-600">{event.organizer.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="mb-4">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Ações</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-red-600 hover:bg-red-700">Confirmar presença</Button>
                  <Button variant="outline" className="w-full" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  <ProtectedAction resource="events" action="update">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={`/events/${event.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar evento
                      </Link>
                    </Button>
                  </ProtectedAction>
                  <ProtectedAction resource="events" action="delete">
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir evento
                    </Button>
                  </ProtectedAction>
                </div>
              </CardContent>
            </Card>

            {event.attendees !== undefined && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Participantes</h3>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-gray-700">{event.attendees} confirmados</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
