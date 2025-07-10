import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Calendar, User } from "lucide-react"
import Link from "next/link"
import type { PrayerRequest } from "@/types"

interface PrayerRequestCardProps {
  prayerRequest: PrayerRequest
  href?: string
}

export function PrayerRequestCard({ prayerRequest, href }: PrayerRequestCardProps) {
  const CardWrapper = href ? Link : "div"
  const cardProps = href ? { href } : {}

  return (
    <CardWrapper {...cardProps}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-gray-900">{prayerRequest.title}</h3>
                {prayerRequest.is_public && <Badge variant="outline">Público</Badge>}
              </div>
              <p className="text-sm text-gray-600 mb-3">{prayerRequest.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {prayerRequest.author.name}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(prayerRequest.created_at).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">{prayerRequest.praying_count} pessoas orando</span>
                <Button size="sm" variant="outline" className="text-purple-600 border-purple-200">
                  <Heart className="h-3 w-3 mr-1" />
                  Orar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  )
}
