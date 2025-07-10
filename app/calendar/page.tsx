"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Header } from "@/components/layout/header"
import { LoadingState } from "@/components/common/loading-state"
import { EmptyState } from "@/components/common/empty-state"
import { EventCard } from "@/components/common/event-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon, Plus } from "lucide-react"
import { useEvents } from "@/hooks/use-events"
import { cn } from "@/lib/utils"
import { ProtectedAction } from "@/components/auth/protected-action"
import Link from "next/link"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const { events, loading, fetchEventsByMonth } = useEvents({
    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toDateString(),
    end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toDateString(),
  })

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const shortDaysOfWeek = ["D", "S", "T", "Q", "Q", "S", "S"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    return days
  }

  const [isNavigating, setIsNavigating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const canNavigate = useCallback((direction: "prev" | "next") => {
    const now = new Date();
    const newDate = new Date(currentDate);
    direction === "prev"
      ? newDate.setMonth(currentDate.getMonth() - 1)
      : newDate.setMonth(currentDate.getMonth() + 1);

    const minDate = new Date();
    minDate.setFullYear(now.getFullYear() - 1); // 1 ano atrás

    const maxDate = new Date();
    maxDate.setFullYear(now.getFullYear() + 1); // 1 ano à frente

    return newDate >= minDate && newDate <= maxDate;
  }, [currentDate]);

  const navigateMonth = useCallback(async (direction: "prev" | "next") => {
    if (isNavigating || !canNavigate(direction)) return;

    if(timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsNavigating(true);

    timeoutRef.current = setTimeout(async () => {
      try {
        const newDate = new Date(currentDate);
        direction === "prev"
          ? newDate.setMonth(currentDate.getMonth() - 1)
          : newDate.setMonth(currentDate.getMonth() + 1);

        setCurrentDate(newDate);
        await fetchEventsByMonth(newDate.getFullYear(), newDate.getMonth(), true);
        setSelectedDate(null);
      } finally {
        setIsNavigating(false);
      }
    }, 200); // Pequeno delay para melhor UX
  }, [currentDate, fetchEventsByMonth, isNavigating, canNavigate]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsNavigating(false);
    };
  }, []);

  const getEventsForDate = (day: number) => {
    if (!day) return []
    const results = events.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      )
    })

    return results;
  }

  const eventDates = Array.from(
    new Set(
      events
        .map((event) => {
          const eventDate = new Date(event.date)
          if (
            eventDate.getMonth() === currentDate.getMonth() &&
            eventDate.getFullYear() === currentDate.getFullYear()
          ) {
            return eventDate.getDate()
          }
          return null
        })
        .filter(Boolean),
    ),
  )

  const days = getDaysInMonth(currentDate)
  const today = new Date()
  const isCurrentMonth =
    currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <Header title="Agenda" />
  //       <main className="p-4 pb-20">
  //         <LoadingState message="Carregando eventos..." />
  //       </main>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Agenda" />

      <main className="p-4 pb-20">
        {/* Mobile Calendar View */}
        <div className="md:hidden">
          <Card className="mb-4">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {shortDaysOfWeek.map((day, index) => (
                  <div key={index} className="text-center text-xs font-medium text-gray-600 py-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const hasEvents = day && eventDates.includes(day)
                  const isToday = isCurrentMonth && day === today.getDate()
                  const isSelected = day === selectedDate

                  return (
                    <div
                      key={index}
                      className={cn(
                        "relative h-10 flex flex-col items-center justify-center text-sm rounded-md",
                        day === null ? "cursor-default" : "hover:bg-gray-100 cursor-pointer",
                        isToday ? "bg-red-100 text-red-600 font-semibold" : "",
                        isSelected ? "bg-red-600 text-white" : "",
                        hasEvents && !isSelected && !isToday ? "bg-blue-50" : "",
                      )}
                      onClick={() => day && setSelectedDate(day)}
                    >
                      {day && (
                        <>
                          <span className="text-sm">{day}</span>
                          {hasEvents && (
                            <div className="absolute bottom-1">
                              <div className={cn("w-1 h-1 rounded-full", isSelected ? "bg-white" : "bg-red-500")} />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">
                {selectedDate ? `Eventos do dia ${selectedDate}` : `Eventos de ${monthNames[currentDate.getMonth()]}`}
              </h2>
              <ProtectedAction resource="events" action="create">
                <Button size="sm" className="bg-red-600 hover:bg-red-700" asChild>
                  <Link href="/events/create">
                    <Plus className="h-4 w-4 mr-1" />
                    Novo
                  </Link>
                </Button>
              </ProtectedAction>
            </div>

            <div className="space-y-3">
              {(selectedDate ? getEventsForDate(selectedDate) : events.slice(0, 3)).map((event) => {
                const uniqueId = event.recurring
                  ? `${event.id}-${event.date.getTime()}`
                  : event.id.toString();

                return (
                  <EventCard
                    key={`${uniqueId}-mobile`}
                    event={event}
                    href={`/events/${event.id}`}
                  />
                );
              })}

              {selectedDate && getEventsForDate(selectedDate).length === 0 && (
                <EmptyState
                  icon={CalendarIcon}
                  title="Nenhum evento neste dia"
                  description="Não há eventos programados para esta data."
                />
              )}
            </div>
          </div>
        </div>

        {/* Desktop Calendar View */}
        <div className="hidden md:grid md:grid-cols-7 md:gap-6">
          <div className="col-span-5">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {shortDaysOfWeek.map((day, index) => (
                    <div key={index} className="text-center text-sm font-medium text-gray-600 p-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    const hasEvents = day && eventDates.includes(day)
                    const isToday = isCurrentMonth && day === today.getDate()
                    const isSelected = day === selectedDate

                    return (
                      <div
                        key={index}
                        className={cn(
                          "relative h-24 p-1 border border-gray-100 rounded-md",
                          day === null ? "bg-gray-50" : "hover:bg-gray-50 cursor-pointer",
                          isToday ? "bg-red-50 border-red-200" : "",
                          isSelected ? "ring-2 ring-red-500 ring-offset-1" : "",
                        )}
                        onClick={() => day && setSelectedDate(day)}
                      >
                        {day && (
                          <>
                            <div
                              className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center mb-1",
                                isToday ? "bg-red-500 text-white" : "",
                                isSelected && !isToday ? "bg-red-100 text-red-800" : "",
                              )}
                            >
                              <span className="text-sm">{day}</span>
                            </div>

                            {hasEvents && (
                              <div className="space-y-1">
                                {getEventsForDate(day)
                                  .slice(0, 2)
                                  .map((event, i) => (
                                    <Link href={`/events/${event.id}`} key={i}>
                                      <div className="bg-red-100 text-red-800 text-xs p-1 rounded truncate">
                                        {event.title}
                                      </div>
                                    </Link>
                                  ))}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{selectedDate ? `Dia ${selectedDate}` : "Próximos Eventos"}</CardTitle>
                  <ProtectedAction resource="events" action="create">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700" asChild>
                      <Link href="/events/create">
                        <Plus className="h-4 w-4 mr-1" />
                        Novo
                      </Link>
                    </Button>
                  </ProtectedAction>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {(selectedDate ? getEventsForDate(selectedDate) : events.length > 3 ? events.slice(0, 3) : events).map((event) => (
                  <EventCard key={`${event.id}-${event.date.getTime()}-web`} event={event} href={`/events/${event.id}`} />
                ))}

                {selectedDate && getEventsForDate(selectedDate).length === 0 && (
                  <EmptyState
                    icon={CalendarIcon}
                    title="Nenhum evento neste dia"
                    description="Não há eventos programados para esta data."
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Eventos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {events.slice(0, 3).map((event, i) => (
                    <Link href={`/events/${event.id}`} key={i}>
                      <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md">
                        <Badge variant="outline" className="bg-gray-100">
                          {new Date(event.date).getDate()}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{event.title}</p>
                          <p className="text-xs text-gray-500">{event.location}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
