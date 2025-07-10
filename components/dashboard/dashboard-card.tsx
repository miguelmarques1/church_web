import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface DashboardCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  color: "yellow" | "pink" | "blue" | "green" | "purple"
}

const colorClasses = {
  yellow: "bg-yellow-400 text-yellow-900",
  pink: "bg-pink-400 text-pink-900",
  blue: "bg-blue-400 text-blue-900",
  green: "bg-green-400 text-green-900",
  purple: "bg-purple-400 text-purple-900",
}

export function DashboardCard({ title, description, icon: Icon, href, color }: DashboardCardProps) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-4", colorClasses[color])}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  )
}
