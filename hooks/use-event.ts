"use client"

import { useState, useEffect } from "react"
import { eventRepository, type CreateEventRequest } from "@/lib/repositories/event-repository"
import type { Event } from "@/types"
import { toast } from "@/hooks/use-toast"

export function useEvent(id?: number) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEvent = async (eventId: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await eventRepository.getById(eventId)

      // Convert date string to Date object
      const eventWithDate = {
        ...data,
        date: new Date(data.date),
      }

      setEvent(eventWithDate)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar evento"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async (eventData: CreateEventRequest) => {
    try {
      setLoading(true)
      setError(null)

      const newEvent = await eventRepository.create(eventData)
      const eventWithDate = {
        ...newEvent,
        date: new Date(newEvent.date),
      }

      setEvent(eventWithDate)
      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso",
      })

      return eventWithDate
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar evento"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateEvent = async (eventId: number, eventData: Partial<CreateEventRequest>) => {
    try {
      setLoading(true)
      setError(null)

      const updatedEvent = await eventRepository.update(eventId, eventData)
      const eventWithDate = {
        ...updatedEvent,
        date: new Date(updatedEvent.date),
      }

      setEvent(eventWithDate)
      toast({
        title: "Sucesso",
        description: "Evento atualizado com sucesso",
      })

      return eventWithDate
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar evento"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (eventId: number) => {
    try {
      setLoading(true)
      setError(null)

      await eventRepository.delete(eventId)
      setEvent(null)

      toast({
        title: "Sucesso",
        description: "Evento excluído com sucesso",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir evento"
      setError(errorMessage)
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchEvent(id)
    }
  }, [id])

  return {
    event,
    loading,
    error,
    fetchEvent,
    createEvent,
    updateEvent,
    deleteEvent,
  }
}
