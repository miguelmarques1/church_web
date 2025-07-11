"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, Eye, Save, Loader2, Calendar } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { useNews } from "@/hooks/use-news"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface FormData {
  title: string
  content: string
  publication_date: Date | undefined
  author_id: string
  featured: boolean
  featured_image: string
}

interface FormErrors {
  title?: string
  content?: string
  publication_date?: string
  author_id?: string
}

export default function CreateNewsPage() {
  const router = useRouter()
  const { createNews, loading: isSubmitting } = useNews()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    publication_date: undefined,
    author_id: "",
    featured: false,
    featured_image: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Conteúdo é obrigatório"
    }

    if (!formData.publication_date) {
      newErrors.publication_date = "Data de publicação é obrigatória"
    }

    if (!formData.author_id.trim()) {
      newErrors.author_id = "ID do autor é obrigatório"
    } else if (isNaN(Number(formData.author_id))) {
      newErrors.author_id = "ID do autor deve ser um número"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean | Date | undefined) => {
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
      setFormData((prev) => ({ ...prev, featured_image: imageUrl }))
      toast.success("Imagem carregada com sucesso!")
    }
  }

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário")
      return
    }

    try {
      await createNews({
        title: formData.title.trim(),
        content: formData.content.trim(),
        publication_date: formData.publication_date!,
        author_id: Number(formData.author_id),
        featured: formData.featured,
        featured_image: formData.featured_image || undefined,
      })
    } catch (error) {
      // Error handling is done in the hook
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="publication_date">Data de Publicação *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full mt-1 justify-start text-left font-normal",
                              !formData.publication_date && "text-muted-foreground",
                              errors.publication_date && "border-red-500",
                            )}
                            disabled={isSubmitting}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {formData.publication_date ? (
                              format(formData.publication_date, "PPP", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={formData.publication_date}
                            onSelect={(date) => handleInputChange("publication_date", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.publication_date && (
                        <p className="text-sm text-red-500 mt-1">{errors.publication_date}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="author_id">ID do Autor *</Label>
                      <Input
                        id="author_id"
                        type="number"
                        placeholder="Digite o ID do autor"
                        value={formData.author_id}
                        onChange={(e) => handleInputChange("author_id", e.target.value)}
                        className={`mt-1 ${errors.author_id ? "border-red-500" : ""}`}
                        disabled={isSubmitting}
                      />
                      {errors.author_id && <p className="text-sm text-red-500 mt-1">{errors.author_id}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Imagem de Destaque</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {formData.featured_image ? (
                        <div className="relative">
                          <Image
                            src={formData.featured_image || "/placeholder.svg"}
                            alt="Preview"
                            width={600}
                            height={300}
                            className="rounded-lg mx-auto"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 bg-transparent"
                            onClick={() => handleInputChange("featured_image", "")}
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
                    <p className="text-sm text-gray-400">{formData.content.length} caracteres</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Featured Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Notícia em Destaque</Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange("featured", checked)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="text-sm text-gray-600">
                    {formData.featured
                      ? "Esta notícia aparecerá em destaque na página inicial."
                      : "Esta notícia aparecerá na lista normal de notícias."}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handlePreview}
                    disabled={isSubmitting}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>

                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={handleSave}
                    disabled={
                      isSubmitting ||
                      !formData.title ||
                      !formData.content ||
                      !formData.publication_date ||
                      !formData.author_id
                    }
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Criar Notícia
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
                  <p>• Defina a data de publicação corretamente</p>
                  <p>• Revise o conteúdo antes de criar</p>
                  <p>• Use "Destaque" para notícias importantes</p>
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
