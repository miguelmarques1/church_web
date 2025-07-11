"use client"

import { Bell, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth/auth-provider"
import { Logo } from "@/components/layout/logo"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { shouldShowInNavigation, canAccessPage } from "@/lib/auth/permissions"
import { useIsMobile } from "@/hooks/use-mobile"

interface HeaderProps {
  title?: string
  showNotification?: boolean
}

const menuItems = [
  { name: "Início", href: "/" },
  { name: "Ministérios", href: "/ministries" },
  { name: "Famílias", href: "/families" },
  { name: "Visitantes", href: "/visitors" },
  { name: "Institucional", href: "/institutional" },
  { name: "Notícias", href: "/news" },
  { name: "Devocionais", href: "/devotionals" },
  { name: "Agenda", href: "/calendar" },
  { name: "Chat", href: "/chat" },
  { name: "Pedidos de Oração", href: "/prayer-requests" },
  { name: "Configurações", href: "/settings" },
  { name: "Membros", href: "/members" },
]

export function Header({ title, showNotification = true }: HeaderProps) {
  const { isAuthenticated, user, login, logout, role } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useIsMobile()

  // Filter menu items based on authentication and permissions
  const filteredMenuItems = menuItems.filter((item) => {
    return shouldShowInNavigation(role, item.href)
  })

  const handleMenuItemClick = (href: string) => {
    if (!canAccessPage(role, href)) {
      login()
    } else {
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">

          <Logo />
          {title && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}
        </div>

        <div className="hidden md:flex items-center space-x-1">
          {filteredMenuItems.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => {
                if (!canAccessPage(role, item.href)) {
                  e.preventDefault()
                  login()
                }
              }}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-red-50 text-red-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              {item.name}
            </Link>
          ))}

          {filteredMenuItems.length > 5 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Mais
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {filteredMenuItems.slice(5).map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (!canAccessPage(role, item.href)) {
                          e.preventDefault()
                          login()
                        }
                      }}
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showNotification && (
            <Button variant="ghost" size="sm" onClick={() => !isAuthenticated && login()}>
              <Bell className="h-5 w-5 text-gray-600" />
            </Button>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-red-600">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" onClick={login}>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">?</span>
              </div>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
