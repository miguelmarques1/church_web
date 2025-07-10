import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, ChevronRight, User } from "lucide-react"
import Link from "next/link"
import type { Ministry } from "@/types"

interface MinistryCardProps {
  ministry: Ministry
  href?: string
}

export function MinistryCard({ ministry, href }: MinistryCardProps) {
  const CardWrapper = href ? Link : "div"
  const cardProps = href ? { href } : {}

  const getMinistryColor = (index: number) => {
    const colors = [
      { bg: "bg-yellow-100", text: "text-yellow-800", icon: "bg-yellow-400" },
      { bg: "bg-blue-100", text: "text-blue-800", icon: "bg-blue-400" },
      { bg: "bg-green-100", text: "text-green-800", icon: "bg-green-400" },
      { bg: "bg-pink-100", text: "text-pink-800", icon: "bg-pink-400" },
      { bg: "bg-purple-100", text: "text-purple-800", icon: "bg-purple-400" },
    ]
    return colors[index % colors.length]
  }

  const colors = getMinistryColor(ministry.id)

  return (
    <CardWrapper {...cardProps}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${colors.icon} rounded-full flex items-center justify-center`}>
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">{ministry.name}</h3>
                  <Badge className={`${colors.bg} ${colors.text}`}>{ministry.members_count || 0} membros</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{ministry.description}</p>
                {ministry.leader && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <User className="h-3 w-3" />
                    Líder: {ministry.leader}
                  </div>
                )}
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </CardWrapper>
  )
}
