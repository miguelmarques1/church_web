"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Users,
  UsersRound,
  UserPlus,
  Building,
  Calendar,
  MessageCircle,
  Newspaper,
  BookOpen,
  Settings,
  Bell,
  User,
  ArrowLeft,
} from "lucide-react"
import { Logo } from "@/components/layout/logo"

const menuItems = [
  {
    category: "Principal",
    items: [
      { href: "/", icon: Home, label: "Início", description: "Painel principal", color: "bg-blue-500" },
      { href: "/members", icon: Users, label: "Membros", description: "Gerenciar membros", color: "bg-green-500" },
      {
        href: "/families",
        icon: UsersRound,
        label: "Famílias",
        description: "Cadastro de famílias",
        color: "bg-purple-500",
      },
      {
        href: "/visitors",
        icon: UserPlus,
        label: "Visitantes",
        description: "Controle de visitantes",
        color: "bg-orange-500",
      },
    ],
  },
  {
    category: "Comunicação",
    items: [
      {
        href: "/chat",
        icon: MessageCircle,
        label: "Chat",
        description: "Conversas em grupo",
        color: "bg-green-600",
        badge: "3",
      },
      { href: "/news", icon: Newspaper, label: "Notícias", description: "Publicar notícias", color: "bg-red-500" },
      {
        href: "/devotionals",
        icon: BookOpen,
        label: "Devocionais",
        description: "Reflexões diárias",
        color: "bg-indigo-500",
      },
    ],
  },
  {
    category: "Organização",
    items: [
      {
        href: "/calendar",
        icon: Calendar,
        label: "Agenda",
        description: "Eventos e compromissos",
        color: "bg-yellow-500",
      },
      {
        href: "/institutional",
        icon: Building,
        label: "Institucional",
        description: "Sobre a igreja",
        color: "bg-gray-500",
      },
    ],
  },
  {
    category: "Configurações",
    items: [
      {
        href: "/settings",
        icon: Settings,
        label: "Configurações",
        description: "Preferências do sistema",
        color: "bg-gray-600",
      },
    ],
  },
]

export default function MenuPage() {
  const goBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={goBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Logo showText={false} />
        <h1 className="text-lg font-semibold text-gray-900">Menu</h1>
      </div>

      <main className="p-4 pb-20 max-w-4xl mx-auto">
        {/* User Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-medium text-gray-900">Usuário Logado</h2>
                <p className="text-sm text-gray-600">Membro da Igreja</p>
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu Categories */}
        {menuItems.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {category.items.map((item, itemIndex) => (
                <Card
                  key={itemIndex}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => (window.location.href = item.href)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{item.label}</h3>
                          {item.badge && <Badge className="bg-red-500 hover:bg-red-600 text-white">{item.badge}</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Versão 1.0.0</p>
          <p className="mt-1">© 2025 Geração Eleita. Todos os direitos reservados.</p>
        </div>
      </main>
    </div>
  )
}
