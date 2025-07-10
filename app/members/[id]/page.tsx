"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Phone, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useMembers } from "@/hooks/use-members"

export default function MemberDetailPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const params = useParams()
  const { members, loading, error } = useMembers()
  const memberId = Number.parseInt(params.id as string)

  const member = members.find((m) => m.id === memberId)

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Membro não encontrado</h2>
          <Link href="/members">
            <Button variant="outline">Voltar para membros</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <Link href="/members">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold text-red-600">Detalhes do Membro</h1>
        </div>

        <main className="p-4 pb-20 md:pb-4">
          {/* Member Profile */}
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-2 border-red-200">
                {member.image_url ? (
                  <Image
                    src={member.image_url || "/placeholder.svg"}
                    alt={member.name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-gray-600" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h2>
              <p className="text-gray-600 mb-4">{member.role.name}</p>

              <div className="flex gap-3 justify-center">
                <Button className="bg-red-600 hover:bg-red-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Ligar
                </Button>
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Mensagem
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Telefone</span>
                <span className="font-medium">{member.phone}</span>
              </div>
              {member.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{member.email}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ecclesiastical Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Informações Eclesiásticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Cargo</span>
                <span className="font-medium">{member.role.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data de Batismo</span>
                <span className="font-medium">10/12/2020</span>
              </div>
              {member.ministries && member.ministries.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Ministério</span>
                  <span className="font-medium">{member.ministries[0].name}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Family Information */}
          {member.family && (
            <Card>
              <CardHeader>
                <CardTitle>Informações Familiares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <span className="text-gray-600">Família</span>
                  <span className="font-medium">{member.family.name}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
