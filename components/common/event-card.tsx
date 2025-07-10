import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import type { Event } from "@/types"

interface EventCardProps {
  event: Event
  href?: string
}

export function EventCard({ event, href }: EventCardProps) {
  const CardWrapper = href ? Link : "div"
  const cardProps = href ? { href } : {}

  return (
    <CardWrapper {...cardProps}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="border-l-4 border-red-500">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 text-red-800 rounded-md p-2 flex-shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">{event.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(event.date).toLocaleDateString("pt-BR")} • {event.time || "Horário não definido"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </CardWrapper>
  )
}
