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
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, Eye, Save, BookOpen, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { devotionalRepository } from "@/lib/repositories/devotional-repository"

interface FormData {
  title: string
  verse: string
  reference: string
  content: string
  author: string
  published: boolean
  imageUrl: string
}

interface FormErrors {
  title?: string
  verse?: string
  reference?: string
  content?: string
}

export default function CreateDevotionalPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    verse: "",
    reference: "",
    content: "",
    author: "",
    published: false,
    imageUrl: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório"
    }

    if (!formData.verse.trim()) {
      newErrors.verse = "Versículo é obrigatório"
    }

    if (!formData.reference.trim()) {
      newErrors.reference = "Referência é obrigatória"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Conteúdo é obrigatório"
    } else if (formData.content.trim().length < 50) {
      newErrors.content = "Conteúdo deve ter pelo menos 50 caracteres"
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

      const devotionalData = {
        title: formData.title.trim(),
        verse_text: formData.verse.trim(),
        reference: formData.reference.trim(),
        content: formData.content.trim(),
        image_url: formData.imageUrl || undefined,
      }

      await devotionalRepository.create(devotionalData)

      toast.success(publish ? "Devocional publicado com sucesso!" : "Devocional salvo como rascunho!")

      router.push("/devotionals")
    } catch (error) {
      console.error("Error saving devotional:", error)
      toast.error("Erro ao salvar devocional. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePreview = () => {
    if (!formData.title && !formData.verse) {
      toast.error("Adicione pelo menos um título e versículo para visualizar")
      return
    }
    // In a real app, this would open a preview modal
    toast.info("Funcionalidade de preview em desenvolvimento")
  }

  const goBack = () => {
    router.push("/devotionals")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={goBack} disabled={isSubmitting}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Novo Devocional</h1>
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
                      placeholder="Digite o título do devocional..."
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className={`mt-1 ${errors.title ? "border-red-500" : ""}`}
                      disabled={isSubmitting}
                    />
                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="verse">Versículo *</Label>
                      <Textarea
                        id="verse"
                        placeholder="Digite o versículo bíblico..."
                        value={formData.verse}
                        onChange={(e) => handleInputChange("verse", e.target.value)}
                        className={`mt-1 ${errors.verse ? "border-red-500" : ""}`}
                        rows={3}
                        disabled={isSubmitting}
                      />
                      {errors.verse && <p className="text-sm text-red-500 mt-1">{errors.verse}</p>}
                    </div>

                    <div>
                      <Label htmlFor="reference">Referência *</Label>
                      <Input
                        id="reference"
                        placeholder="Ex: João 3:16"
                        value={formData.reference}
                        onChange={(e) => handleInputChange("reference", e.target.value)}
                        className={`mt-1 ${errors.reference ? "border-red-500" : ""}`}
                        disabled={isSubmitting}
                      />
                      {errors.reference && <p className="text-sm text-red-500 mt-1">{errors.reference}</p>}
                    </div>
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
                </CardContent>
              </Card>

              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Imagem de Fundo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {formData.imageUrl ? (
                        <div className="relative">
                          <div className="relative h-48 rounded-lg overflow-hidden">
                            <Image
                              src={formData.imageUrl || "/placeholder.svg"}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4">
                              <div className="text-white">
                                <p className="text-sm opacity-90">"{formData.verse || "Versículo aparecerá aqui"}"</p>
                                <p className="text-xs opacity-75">{formData.reference || "Referência"}</p>
                              </div>
                            </div>
                          </div>
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
                          <p className="text-gray-600 mb-2">Adicione uma imagem inspiradora</p>
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
                  <CardTitle>Reflexão</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Escreva a reflexão devocional..."
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    rows={12}
                    className={`resize-none ${errors.content ? "border-red-500" : ""}`}
                    disabled={isSubmitting}
                  />
                  {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content}</p>}
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-500">
                      Compartilhe uma reflexão inspiradora baseada no versículo escolhido.
                    </p>
                    <p className="text-sm text-gray-400">{formData.content.length}/50 caracteres mínimos</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview Card */}
              {(formData.title || formData.verse) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-gray-800 to-gray-600 rounded-lg p-4 text-white text-center">
                      <h3 className="font-semibold mb-2">{formData.title || "Título do Devocional"}</h3>
                      <p className="text-sm opacity-90 mb-2">
                        "{formData.verse || "Versículo bíblico aparecerá aqui"}"
                      </p>
                      <p className="text-xs opacity-75">{formData.reference || "Referência bíblica"}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

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
                      ? "O devocional será publicado e ficará visível para todos."
                      : "O devocional será salvo como rascunho."}
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
                    disabled={
                      isSubmitting || !formData.title || !formData.verse || !formData.reference || !formData.content
                    }
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : "Publicar Devocional"}
                  </Button>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Dicas</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p>• Escolha um versículo significativo</p>
                  <p>• Use uma imagem inspiradora</p>
                  <p>• Escreva uma reflexão pessoal</p>
                  <p>• Mantenha a linguagem acessível</p>
                  <p>• Inclua uma aplicação prática</p>
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
