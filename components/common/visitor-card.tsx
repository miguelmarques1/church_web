import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Phone, Calendar, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { Visitor } from "@/hooks/use-visitors"

interface VisitorCardProps {
  visitor: Visitor
  href?: string
}

export function VisitorCard({ visitor, href }: VisitorCardProps) {
  const CardWrapper = href ? Link : "div"
  const cardProps = href ? { href } : {}

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Primeira visita":
        return "bg-blue-100 text-blue-800"
      case "Retornando":
        return "bg-green-100 text-green-800"
      case "Interessado":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <CardWrapper {...cardProps}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">{visitor.name}</h3>
                  <Badge className={getStatusColor(visitor.status)}>{visitor.status}</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    {visitor.phone}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    Visitou em {new Date(visitor.visitDate).toLocaleDateString("pt-BR")}
                  </div>
                  <p className="text-xs text-gray-500">Convidado por {visitor.invitedBy}</p>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  )
}
