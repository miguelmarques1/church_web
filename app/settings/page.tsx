"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, ImageIcon, Bell, Lock, User, Globe, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const settingsGroups = [
    {
      title: "Personalização",
      items: [
        {
          icon: ImageIcon,
          label: "Logo e Identidade Visual",
          description: "Altere o logo e as cores do aplicativo",
          href: "/settings/logo",
          color: "text-blue-500",
        },
        {
          icon: Bell,
          label: "Notificações",
          description: "Configure as notificações do sistema",
          href: "/settings/notifications",
          color: "text-red-500",
        },
      ],
    },
    {
      title: "Conta",
      items: [
        {
          icon: User,
          label: "Perfil",
          description: "Edite suas informações pessoais",
          href: "/settings/profile",
          color: "text-green-500",
        },
        {
          icon: Lock,
          label: "Segurança",
          description: "Altere sua senha e configurações de segurança",
          href: "/settings/security",
          color: "text-yellow-500",
        },
      ],
    },
    {
      title: "Sistema",
      items: [
        {
          icon: Globe,
          label: "Idioma",
          description: "Altere o idioma do sistema",
          href: "/settings/language",
          color: "text-purple-500",
        },
        {
          icon: HelpCircle,
          label: "Ajuda e Suporte",
          description: "Entre em contato com o suporte",
          href: "/settings/support",
          color: "text-indigo-500",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1">
        <Header title="Configurações" />

        <main className="p-4 pb-20 md:pb-4 max-w-3xl mx-auto">
          {settingsGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{group.title}</h2>
              <div className="space-y-2">
                {group.items.map((item, itemIndex) => (
                  <Link key={itemIndex} href={item.href}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${item.color}`}
                            >
                              <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{item.label}</h3>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center text-sm text-gray-500 mt-8">
            <p>Versão 1.0.0</p>
            <p className="mt-1">© 2025 Geração Eleita. Todos os direitos reservados.</p>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
