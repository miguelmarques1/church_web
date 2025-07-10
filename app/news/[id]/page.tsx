"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { BottomNav } from "@/components/layout/bottom-nav"
import {
  ArrowLeft,
  Share2,
  Heart,
  MessageCircle,
  Calendar,
  User,
  Send,
  MoreVertical,
  Eye,
  Tag,
  Clock,
} from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"

const mockNews = {
  id: 1,
  title: "Evento de Jovens - Maio 2025: Uma Noite de Adoração e Comunhão",
  excerpt: "Grande encontro de jovens com palestras, louvor e muito mais para fortalecer nossa fé e comunidade.",
  content: `O Ministério de Jovens da Igreja Geração Eleita tem o prazer de convidar todos os jovens para uma noite especial de adoração, comunhão e crescimento espiritual.

**Programação do Evento:**

**19h00 - Abertura e Louvor**
Começaremos com um tempo de adoração conduzido pela banda jovem da igreja. Prepare seu coração para um encontro genuíno com Deus através da música.

**19h30 - Dinâmica de Integração**
Momento para conhecer novos amigos e fortalecer os laços de amizade que já existem. Teremos atividades divertidas e edificantes.

**20h00 - Palavra com Pastor Carlos**
O Pastor Carlos trará uma mensagem especial sobre "Vivendo a fé na prática", abordando como podemos ser luz em nossa geração.

**20h45 - Testemunhos**
Jovens compartilharão como Deus tem transformado suas vidas e os desafios que enfrentaram.

**21h15 - Lanche Comunitário**
Momento de confraternização com lanche preparado com muito carinho pela equipe de apoio.

**Informações Importantes:**

- **Data:** 30 de Maio de 2025 (Sexta-feira)
- **Horário:** 19h00 às 22h00
- **Local:** Auditório Principal da Igreja
- **Idade:** 15 a 30 anos
- **Investimento:** Gratuito
- **Inscrições:** Até 28 de Maio

**Como se inscrever:**
Entre em contato com a liderança do ministério de jovens ou procure o Pastor Carlos após os cultos. Também é possível se inscrever pelo WhatsApp (11) 99999-9999.

Não perca essa oportunidade de crescer espiritualmente e fazer novos amigos! Traga seus amigos e familiares. Será uma noite inesquecível!

**"Lembra-te do teu Criador nos dias da tua mocidade" - Eclesiastes 12:1**`,
  imageUrl: "/placeholder.svg?height=400&width=800",
  createdAt: new Date(2025, 4, 25),
  author: {
    name: "Pastor Carlos Mendes",
    imageUrl: "/placeholder.svg?height=40&width=40",
  },
  category: "Eventos",
  views: 245,
  likes: 18,
  comments: 12,
  isLiked: false,
  tags: ["jovens", "evento", "adoração", "comunhão"],
}

const mockComments = [
  {
    id: 1,
    author: "Ana Silva",
    content: "Que evento maravilhoso! Já estou ansiosa para participar. Vou levar minhas amigas também!",
    timestamp: new Date(2025, 4, 25, 10, 30),
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    author: "João Santos",
    content: "A programação está incrível! Principalmente a parte dos testemunhos. Deus vai fazer algo especial.",
    timestamp: new Date(2025, 4, 25, 14, 15),
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    author: "Maria Oliveira",
    content: "Como faço para me inscrever? Posso levar meu irmão que tem 14 anos?",
    timestamp: new Date(2025, 4, 25, 16, 45),
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export default function NewsDetailPage() {
  const [isLiked, setIsLiked] = useState(mockNews.isLiked)
  const [likes, setLikes] = useState(mockNews.likes)
  const [newComment, setNewComment] = useState("")
  const [showComments, setShowComments] = useState(false)
  const params = useParams()
  const router = useRouter()

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockNews.title,
        text: mockNews.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const submitComment = () => {
    if (newComment.trim()) {
      console.log("Submitting comment:", newComment)
      setNewComment("")
    }
  }

  const goBack = () => {
    router.push("/news")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Notícia</h1>
          <div className="ml-auto flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <main className="p-4 pb-20 md:pb-4 max-w-4xl mx-auto">
          {/* Hero Image */}
          <Card className="mb-6 overflow-hidden">
            <div className="relative h-64 md:h-80">
              <Image src={mockNews.imageUrl || "/placeholder.svg"} alt={mockNews.title} fill className="object-cover" />
            </div>
          </Card>

          {/* Article Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-red-100 text-red-800">
                  <Tag className="h-3 w-3 mr-1" />
                  {mockNews.category}
                </Badge>
                {mockNews.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">{mockNews.title}</h1>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">{mockNews.excerpt}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
                    <Image
                      src={mockNews.author.imageUrl || "/placeholder.svg"}
                      alt={mockNews.author.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{mockNews.author.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {mockNews.createdAt.toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />5 min de leitura
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Eye className="h-4 w-4" />
                  {mockNews.views} visualizações
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Content */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="prose prose-gray max-w-none">
                {mockNews.content.split("\n\n").map((paragraph, index) => {
                  if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                    return (
                      <h3 key={index} className="text-xl font-semibold text-gray-900 mt-8 mb-4">
                        {paragraph.slice(2, -2)}
                      </h3>
                    )
                  }
                  if (paragraph.includes("**") && !paragraph.startsWith("**")) {
                    const parts = paragraph.split("**")
                    return (
                      <p key={index} className="text-gray-700 leading-relaxed mb-4">
                        {parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))}
                      </p>
                    )
                  }
                  return (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={isLiked ? "text-red-600" : "text-gray-600"}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                    {likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowComments(!showComments)}
                    className="text-gray-600"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {mockComments.length}
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={handleShare} className="text-gray-600">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          {showComments && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-4">Comentários ({mockComments.length})</h3>

                {/* Add Comment */}
                <div className="mb-6">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Deixe seu comentário..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mb-2"
                        rows={3}
                      />
                      <Button
                        onClick={submitComment}
                        disabled={!newComment.trim()}
                        size="sm"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Comentar
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden">
                        <Image
                          src={comment.avatar || "/placeholder.svg"}
                          alt={comment.author}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h4 className="font-medium text-gray-900 text-sm">{comment.author}</h4>
                          <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {comment.timestamp.toLocaleDateString("pt-BR")} às{" "}
                          {comment.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
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
