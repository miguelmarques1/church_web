"use client"

import { Home, Newspaper, BookOpen, Calendar, Heart, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth/auth-provider"
import { shouldShowInNavigation, canAccessPage } from "@/lib/auth/permissions"

const mainNavItems = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/news", icon: Newspaper, label: "Notícias" },
  { href: "/devotionals", icon: BookOpen, label: "Devocionais" },
  { href: "/calendar", icon: Calendar, label: "Agenda" },
  { href: "/prayer-requests", icon: Heart, label: "Oração" },
]

const menuItems = [
  { name: "Institucional", href: "/institutional" },
  { name: "Ministérios", href: "/ministries" },
  { name: "Famílias", href: "/families" },
  { name: "Visitantes", href: "/visitors" },
  { name: "Chat", href: "/chat" },
  { name: "Configurações", href: "/settings" },
]

export function BottomNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, role, isAuthenticated, login } = useAuth()

  // Filter menu items based on authentication and permissions
  const filteredMenuItems = menuItems.filter((item) => {
    if (!isAuthenticated && !["/institutional"].includes(item.href)) {
      return false
    }
    return shouldShowInNavigation(role, item.href)
  })

  const handleNavClick = (href: string) => {
    if (!canAccessPage(role, href)) {
      login()
      return
    }
  }

  const handleMenuItemClick = (href: string) => {
    if (!canAccessPage(role, href)) {
      login()
    } else {
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <nav className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg px-3 py-2">
        <div className="flex items-center gap-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  if (!canAccessPage(role, item.href)) {
                    e.preventDefault()
                    handleNavClick(item.href)
                  }
                }}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-0",
                  isActive ? "text-red-600 bg-red-50 scale-105" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Link>
            )
          })}

          {/* Menu Sheet */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200",
                  "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                )}
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs font-medium">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <div className="grid grid-cols-2 gap-3">
                  {filteredMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        if (!canAccessPage(role, item.href)) {
                          e.preventDefault()
                          handleMenuItemClick(item.href)
                        } else {
                          setIsMenuOpen(false)
                        }
                      }}
                      className={cn(
                        "flex items-center justify-center p-4 text-sm font-medium rounded-xl border transition-colors",
                        pathname === item.href
                          ? "bg-red-50 text-red-600 border-red-200"
                          : "text-gray-600 hover:bg-gray-50 border-gray-200",
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {!isAuthenticated && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => {
                        login()
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl"
                    >
                      Entrar
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  )
}
