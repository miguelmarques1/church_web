"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, Eye, Save, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { newsRepository } from "@/lib/repositories/news-repository"

interface FormData {
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  published: boolean
  imageUrl: string
}

interface FormErrors {
  title?: string
  content?: string
  category?: string
}

export default function CreateNewsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    published: false,
    imageUrl: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const categories = ["Eventos", "Conferências", "Campanhas", "Retiros", "Ministérios", "Comunidade", "Anúncios"]

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Conteúdo é obrigatório"
    } else if (formData.content.trim().length < 100) {
      newErrors.content = "Conteúdo deve ter pelo menos 100 caracteres"
    }

    if (!formData.category) {
      newErrors.category = "Categoria é obrigatória"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a file service
      // For now, we'll simulate with a placeholder
      const imageUrl = "/placeholder.svg?height=300&width=600"
      setFormData((prev) => ({ ...prev, imageUrl }))
      toast.success("Imagem carregada com sucesso!")
    }
  }

  const handleSave = async (publish = false) => {
    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário")
      return
    }

    try {
      setIsSubmitting(true)

      const newsData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        excerpt: formData.excerpt.trim() || undefined,
        category: formData.category,
        image_url: formData.imageUrl || undefined,
        published: publish,
      }

      await newsRepository.create(newsData)

      toast.success(publish ? "Notícia publicada com sucesso!" : "Notícia salva como rascunho!")

      router.push("/news")
    } catch (error) {
      console.error("Error saving news:", error)
      toast.error("Erro ao salvar notícia. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePreview = () => {
    if (!formData.title && !formData.content) {
      toast.error("Adicione pelo menos um título e conteúdo para visualizar")
      return
    }
    // In a real app, this would open a preview modal
    toast.info("Funcionalidade de preview em desenvolvimento")
  }

  const goBack = () => {
    router.push("/news")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={goBack} disabled={isSubmitting}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Nova Notícia</h1>
        </div>

        <main className="p-4 pb-20 md:pb-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      placeholder="Digite o título da notícia..."
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className={`mt-1 ${errors.title ? "border-red-500" : ""}`}
                      disabled={isSubmitting}
                    />
                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Resumo</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Breve descrição da notícia..."
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange("excerpt", e.target.value)}
                      className="mt-1"
                      rows={3}
                      disabled={isSubmitting}
                    />
                    <p className="text-sm text-gray-500 mt-1">Resumo opcional que aparecerá na lista de notícias</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Categoria *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleInputChange("category", value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className={`mt-1 ${errors.category ? "border-red-500" : ""}`}>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
                    </div>

                    <div>
                      <Label htmlFor="author">Autor</Label>
                      <Input
                        id="author"
                        placeholder="Nome do autor"
                        value={formData.author}
                        onChange={(e) => handleInputChange("author", e.target.value)}
                        className="mt-1"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Imagem de Destaque</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {formData.imageUrl ? (
                        <div className="relative">
                          <Image
                            src={formData.imageUrl || "/placeholder.svg"}
                            alt="Preview"
                            width={600}
                            height={300}
                            className="rounded-lg mx-auto"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleInputChange("imageUrl", "")}
                            disabled={isSubmitting}
                          >
                            Remover Imagem
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">Clique para fazer upload ou arraste uma imagem</p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                            disabled={isSubmitting}
                          />
                          <Label htmlFor="image-upload" className="cursor-pointer">
                            <Button variant="outline" asChild disabled={isSubmitting}>
                              <span>Selecionar Imagem</span>
                            </Button>
                          </Label>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Conteúdo</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Escreva o conteúdo completo da notícia..."
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    rows={12}
                    className={`resize-none ${errors.content ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content}</p>}
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">Escreva o conteúdo completo da notícia com detalhes.</p>
                    <p className="text-sm text-gray-400">{formData.content.length}/100 caracteres mínimos</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Publicação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="published">Publicar imediatamente</Label>
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => handleInputChange("published", checked)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="text-sm text-gray-600">
                    {formData.published
                      ? "A notícia será publicada e ficará visível para todos."
                      : "A notícia será salva como rascunho."}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full" onClick={handlePreview} disabled={isSubmitting}>
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSave(false)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Salvar Rascunho
                  </Button>

                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => handleSave(true)}
                    disabled={isSubmitting || !formData.title || !formData.content || !formData.category}
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "Publicar Notícia"}
                  </Button>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Dicas</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p>• Use um título claro e atrativo</p>
                  <p>• Adicione uma imagem de qualidade</p>
                  <p>• Escreva um resumo envolvente</p>
                  <p>• Revise o conteúdo antes de publicar</p>
                  <p>• Escolha a categoria apropriada</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
