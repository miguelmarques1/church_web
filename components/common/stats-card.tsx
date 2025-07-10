import { Card, CardContent } from "@/components/ui/card"
import type { StatsCardProps } from "@/types"

export function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        {Icon && (
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon className="h-6 w-6 text-red-600" />
          </div>
        )}
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{title}</div>
        {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
      </CardContent>
    </Card>
  )
}
