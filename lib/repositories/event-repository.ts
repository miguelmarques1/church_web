import { restClient } from "@/lib/api/rest-client"
import type { Event } from "@/types"

interface CreateEventRequest {
  title: string
  description?: string
  date: string
  location: string
  image_url?: string
  recurring?: boolean
  category?: string
}

interface EventFilters {
  start?: string
  end?: string
}

class EventRepository {
  async getAll(filters?: EventFilters): Promise<Event[]> {
    try {
      const params = new URLSearchParams()

      if (filters?.start) params.append("start", filters.start)
      if (filters?.end) params.append("end", filters.end)

      const url = `/events${params.toString() ? `?${params.toString()}` : ""}`
      const response = await restClient.get<{ data: Event[]; error: boolean; message: string | null }>(url)

      if (response.data && !response.data.error) {
        return response.data.data.map((event) => ({
          ...event,
          date: new Date(event.date),
        }))
      }

      throw new Error(response.data?.message || "Failed to fetch events")
    } catch (error) {
      console.error("Error fetching events:", error)
      throw error
    }
  }

  async getByDateRange(startDate: Date, endDate: Date, published = true): Promise<Event[]> {
    const filters: EventFilters = {
      start: startDate.toISOString().split("T")[0],
      end: endDate.toISOString().split("T")[0],
    }

    return this.getAll(filters)
  }

  async getByMonth(year: number, month: number, published = true): Promise<Event[]> {
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    return this.getByDateRange(startDate, endDate, published)
  }

  async getById(id: number): Promise<Event> {
    try {
      const response = await restClient.get<{ data: Event; error: boolean; message: string | null }>(`/events/${id}`)

      if (response.data && !response.data.error) {
        return {
          ...response.data.data,
          date: new Date(response.data.data.date),
        }
      }

      throw new Error(response.data?.message || "Failed to fetch event")
    } catch (error) {
      console.error("Error fetching event:", error)
      throw error
    }
  }

  async create(eventData: CreateEventRequest): Promise<Event> {
    try {
      const response = await restClient.post<{ data: Event; error: boolean; message: string | null }>(
        "/events",
        eventData,
      )

      if (response.data && !response.data.error) {
        return {
          ...response.data.data,
          date: new Date(response.data.data.date),
        }
      }

      throw new Error(response.data?.message || "Failed to create event")
    } catch (error) {
      console.error("Error creating event:", error)
      throw error
    }
  }

  async update(id: number, eventData: Partial<CreateEventRequest>): Promise<Event> {
    try {
      const response = await restClient.put<{ data: Event; error: boolean; message: string | null }>(
        `/events/${id}`,
        eventData,
      )

      if (response.data && !response.data.error) {
        return {
          ...response.data.data,
          date: new Date(response.data.data.date),
        }
      }

      throw new Error(response.data?.message || "Failed to update event")
    } catch (error) {
      console.error("Error updating event:", error)
      throw error
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const response = await restClient.delete<{ error: boolean; message: string | null }>(`/events/${id}`)

      if (response.data && response.data.error) {
        throw new Error(response.data.message || "Failed to delete event")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      throw error
    }
  }

  async addAttendee(eventId: number, memberId: number): Promise<void> {
    try {
      const response = await restClient.post<{ error: boolean; message: string | null }>(
        `/events/${eventId}/attendees/${memberId}`,
      )

      if (response.data && response.data.error) {
        throw new Error(response.data.message || "Failed to add attendee")
      }
    } catch (error) {
      console.error("Error adding attendee:", error)
      throw error
    }
  }

  async removeAttendee(eventId: number, memberId: number): Promise<void> {
    try {
      const response = await restClient.delete<{ error: boolean; message: string | null }>(
        `/events/${eventId}/attendees/${memberId}`,
      )

      if (response.data && response.data.error) {
        throw new Error(response.data.message || "Failed to remove attendee")
      }
    } catch (error) {
      console.error("Error removing attendee:", error)
      throw error
    }
  }
}

export const eventRepository = new EventRepository()
export type { CreateEventRequest, EventFilters }
