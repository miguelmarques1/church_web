import { Card, CardContent } from "@/components/ui/card"
import { User, Phone, Mail, Calendar } from "lucide-react"
import Link from "next/link"
import type { Member } from "@/types"

interface MemberCardProps {
  member: Member
  href?: string
}

export function MemberCard({ member, href }: MemberCardProps) {
  const CardWrapper = href ? Link : "div"
  const cardProps = href ? { href } : {}

  return (
    <CardWrapper {...cardProps}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{member.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{member.phone || "Não informado"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>{member.email || "Não informado"}</span>
                </div>
                {member.created_at && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>Membro desde {new Date(member.created_at).toLocaleDateString("pt-BR")}</span>
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
