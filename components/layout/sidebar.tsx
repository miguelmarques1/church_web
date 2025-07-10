"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/layout/logo"
import { X } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { shouldShowInNavigation, canAccessPage } from "@/lib/auth/permissions"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function Sidebar({ isOpen, onClose, className }: SidebarProps) {
  const pathname = usePathname()
  const { user, role, isAuthenticated, login } = useAuth()

  const navItems = [
    { name: "Início", href: "/" },
    { name: "Notícias", href: "/news" },
    { name: "Devocionais", href: "/devotionals" },
    { name: "Calendário", href: "/calendar" },
    { name: "Pedidos de Oração", href: "/prayer-requests" },
    { name: "Institucional", href: "/institutional" },
    { name: "Ministérios", href: "/ministries" },
    { name: "Famílias", href: "/families" },
    { name: "Visitantes", href: "/visitors" },
    { name: "Chat", href: "/chat" },
    { name: "Configurações", href: "/settings" },
  ]

  // Filter navigation items based on authentication status and role
  const filteredNavItems = navItems.filter((item) => {
    // If user is not authenticated, only show public pages
    if (!isAuthenticated) {
      return ["/", "/news", "/devotionals", "/calendar", "/prayer-requests", "/institutional"].includes(item.href)
    }

    // Otherwise, check permissions based on role
    return shouldShowInNavigation(role, item.href)
  })

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Logo />
          <Button variant="ghost" size="sm" onClick={onClose} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="py-4">
          <nav className="space-y-1 px-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (!canAccessPage(role, item.href)) {
                    e.preventDefault()
                    login()
                  } else {
                    onClose()
                  }
                }}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-red-50 text-red-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {!user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center text-red-600 border-red-600 hover:bg-red-50"
              onClick={login}
            >
              <span className="mr-2">Entrar</span>
            </Button>
          </div>
        )}
      </aside>
    </>
  )
}
