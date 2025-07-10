"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { hasPermission } from "@/lib/auth/permissions"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, Save, User, Phone, Building } from "lucide-react"
import Image from "next/image"

const mockRoles = [
  { id: 1, name: "Membro", credentials: "member" },
  { id: 2, name: "Líder de Jovens", credentials: "leader" },
  { id: 3, name: "Líder de Ministério", credentials: "leader" },
  { id: 4, name: "Pastor", credentials: "pastor" },
  { id: 5, name: "Administrador", credentials: "admin" },
]

const mockMinistries = [
  { id: 1, name: "Ministério de Louvor" },
  { id: 2, name: "Ministério de Ensino" },
  { id: 3, name: "Ministério de Jovens" },
  { id: 4, name: "Ministério Infantil" },
  { id: 5, name: "Ministério Social" },
]

const mockFamilies = [
  { id: 1, name: "Família Silva" },
  { id: 2, name: "Família Santos" },
  { id: 3, name: "Família Oliveira" },
  { id: 4, name: "Família Costa" },
]

export default function CreateMemberPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, role, login } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    gender: "",
    phone: "",
    email: "",
    roleId: "",
    familyId: "",
    imageUrl: "",
    ministries: [] as number[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check authentication and permissions
    if (!user) {
      router.push("/login")
      return
    }

    if (!hasPermission(role, "members", "create")) {
      router.push("/members")
      return
    }

    setIsLoading(false)
  }, [user, role, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleMinistryChange = (ministryId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      ministries: checked ? [...prev.ministries, ministryId] : prev.ministries.filter((id) => id !== ministryId),
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simulate image upload
      const imageUrl = "/placeholder.svg?height=200&width=200"
      setFormData((prev) => ({ ...prev, imageUrl }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório"
    } else if (!/^$$\d{2}$$\s\d{4,5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = "Formato inválido. Use: (11) 99999-9999"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.gender) {
      newErrors.gender = "Gênero é obrigatório"
    }

    if (!formData.roleId) {
      newErrors.roleId = "Cargo é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Creating member:", formData)
      router.push("/members")
    } catch (error) {
      console.error("Error creating member:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3")
    }
    return value
  }

  const goBack = () => {
    router.push("/members")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Novo Membro</h1>
        </div>

        <main className="p-4 pb-20 md:pb-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      placeholder="Digite o nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="birthdate">Data de Nascimento</Label>
                      <Input
                        id="birthdate"
                        type="date"
                        value={formData.birthdate}
                        onChange={(e) => handleInputChange("birthdate", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender">Gênero *</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                          <SelectValue placeholder="Selecione o gênero" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Masculino</SelectItem>
                          <SelectItem value="female">Feminino</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && <p className="text-sm text-red-600 mt-1">{errors.gender}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Informações de Contato
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", formatPhoneNumber(e.target.value))}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="exemplo@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Church Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Informações Eclesiásticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="role">Cargo *</Label>
                    <Select value={formData.roleId} onValueChange={(value) => handleInputChange("roleId", value)}>
                      <SelectTrigger className={errors.roleId ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.roleId && <p className="text-sm text-red-600 mt-1">{errors.roleId}</p>}
                  </div>

                  <div>
                    <Label htmlFor="family">Família</Label>
                    <Select value={formData.familyId} onValueChange={(value) => handleInputChange("familyId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma família (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockFamilies.map((family) => (
                          <SelectItem key={family.id} value={family.id.toString()}>
                            {family.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Ministérios</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {mockMinistries.map((ministry) => (
                        <div key={ministry.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`ministry-${ministry.id}`}
                            checked={formData.ministries.includes(ministry.id)}
                            onCheckedChange={(checked) => handleMinistryChange(ministry.id, checked as boolean)}
                          />
                          <Label htmlFor={`ministry-${ministry.id}`} className="text-sm">
                            {ministry.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Photo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Foto do Membro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    {formData.imageUrl ? (
                      <div className="relative">
                        <Image
                          src={formData.imageUrl || "/placeholder.svg"}
                          alt="Preview"
                          width={150}
                          height={150}
                          className="rounded-full mx-auto mb-4"
                        />
                        <Button variant="outline" size="sm" onClick={() => handleInputChange("imageUrl", "")}>
                          Remover Foto
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <User className="h-12 w-12 text-gray-400" />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <Label htmlFor="photo-upload" className="cursor-pointer">
                          <Button variant="outline" asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              Adicionar Foto
                            </span>
                          </Button>
                        </Label>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-700">
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Salvando..." : "Salvar Membro"}
                  </Button>

                  <Button variant="outline" onClick={goBack} className="w-full">
                    Cancelar
                  </Button>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Dicas</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p>• Campos marcados com * são obrigatórios</p>
                  <p>• Use uma foto clara e recente</p>
                  <p>• Verifique os dados antes de salvar</p>
                  <p>• O telefone deve estar no formato correto</p>
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
