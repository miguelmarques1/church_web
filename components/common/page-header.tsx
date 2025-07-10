"use client"

import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProtectedAction } from "@/components/auth/protected-action"
import Link from "next/link"
import type { PageHeaderProps } from "@/types"

export function PageHeader({ title, searchPlaceholder, searchValue, onSearchChange, createButton }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {createButton && (
        <ProtectedAction resource={title.toLowerCase()} action="create">
          <Button className="ml-4 bg-red-600 hover:bg-red-700" asChild>
            <Link href={createButton.href}>
              <Plus className="h-4 w-4 mr-2" />
              {createButton.label}
            </Link>
          </Button>
        </ProtectedAction>
      )}
    </div>
  )
}
