"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, Edit, Trash2 } from "lucide-react"
import { ProtectedAction } from "@/components/auth/protected-action"
import Image from "next/image"
import Link from "next/link"
import type { News } from "@/types"

interface NewsCardProps {
  news: News
  onDelete?: (id: number) => void
}

export function NewsCard({ news, onDelete }: NewsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-48 h-48 md:h-32">
            <Image
              src={news.image_url || "/placeholder.svg?height=200&width=300"}
              alt={news.title}
              fill
              className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
            />
            {!news.published && (
              <div className="absolute top-2 left-2">
                <Badge variant="secondary">Rascunho</Badge>
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {news.category}
                  </Badge>
                  <span className="text-xs text-gray-500">por {news.author}</span>
                </div>
                <Link href={`/news/${news.id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-red-600">{news.title}</h3>
                </Link>
                <p className="text-sm text-gray-600 mb-3">{news.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(news.created_at).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {news.views || 0} visualizações
                  </div>
                </div>
              </div>
              <div className="flex gap-1 ml-4">
                <ProtectedAction resource="news" action="update">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/news/${news.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </ProtectedAction>
                <ProtectedAction resource="news" action="delete">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => onDelete?.(news.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </ProtectedAction>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
