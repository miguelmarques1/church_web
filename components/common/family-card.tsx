import { Card, CardContent } from "@/components/ui/card"
import { Users, Phone, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import type { Family } from "@/types"

interface FamilyCardProps {
  family: Family
  href?: string
}

export function FamilyCard({ family, href }: FamilyCardProps) {
  const CardWrapper = href ? Link : "div"
  const cardProps = href ? { href } : {}

  return (
    <CardWrapper {...cardProps}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-pink-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{family.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{family.phone || "Não informado"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{family.address || "Não informado"}</span>
                </div>
                {family.created_at && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Desde {new Date(family.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  )
}
