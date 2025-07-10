"use client"

import { useState, useEffect } from "react"
import { eventRepository, type EventFilters } from "@/lib/repositories/event-repository"
import type { Event } from "@/types"
import { toast } from "@/hooks/use-toast"

export function useEvents(initialFilters?: EventFilters) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<EventFilters>(initialFilters || {})

  const fetchEvents = async (newFilters?: EventFilters) => {
    try {
      setLoading(true)
      setError(null)

      const filtersToUse = newFilters || filters
      const data = await eventRepository.getAll(filtersToUse)

      // Events are already sorted by date from the API
      setEvents(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar eventos"
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

  const fetchEventsByMonth = async (year: number, month: number, published = true) => {
    try {
      setLoading(true)
      setError(null)

      const data = await eventRepository.getByMonth(year, month, published)
      setEvents(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar eventos do mês"
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

  const fetchEventsByDateRange = async (startDate: Date, endDate: Date, published = true) => {
    try {
      setLoading(true)
      setError(null)

      const data = await eventRepository.getByDateRange(startDate, endDate, published)
      setEvents(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar eventos"
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

  const updateFilters = (newFilters: Partial<EventFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    fetchEvents(updatedFilters)
  }

  const deleteEvent = async (id: number) => {
    try {
      await eventRepository.delete(id)
      setEvents((prev) => prev.filter((event) => event.id !== id))
      toast({
        title: "Sucesso",
        description: "Evento excluído com sucesso",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir evento"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const addAttendee = async (eventId: number, memberId: number) => {
    try {
      await eventRepository.addAttendee(eventId, memberId)
      // Update local state to increment attendees count
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? { ...event, attendees: (event.attendees || 0) + 1 } : event)),
      )
      toast({
        title: "Sucesso",
        description: "Participante adicionado ao evento",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao adicionar participante"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const removeAttendee = async (eventId: number, memberId: number) => {
    try {
      await eventRepository.removeAttendee(eventId, memberId)
      // Update local state to decrement attendees count
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, attendees: Math.max((event.attendees || 0) - 1, 0) } : event,
        ),
      )
      toast({
        title: "Sucesso",
        description: "Participante removido do evento",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao remover participante"
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
      throw err
    }
  }

  const getUpcomingEvents = () => {
    const now = new Date()
    return events.filter((event) => event.date >= now)
  }

  const getPastEvents = () => {
    const now = new Date()
    return events.filter((event) => event.date < now)
  }

  const getEventsByCategory = (category: string) => {
    return events.filter((event) => event.category === category)
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return {
    events,
    loading,
    error,
    filters,
    fetchEvents,
    fetchEventsByMonth,
    fetchEventsByDateRange,
    updateFilters,
    deleteEvent,
    addAttendee,
    removeAttendee,
    getUpcomingEvents,
    getPastEvents,
    getEventsByCategory,
  }
}
