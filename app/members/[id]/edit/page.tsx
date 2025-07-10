"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, Save, User, Phone, Building, Trash2 } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { memberRepository } from "@/lib/repositories/member-repository"
import { useRoles } from "@/hooks/use-roles"
import { useFamilies } from "@/hooks/use-families"
import { useMinistries } from "@/hooks/use-ministries"


export default function EditMemberPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
  const {roles, loading: loadingRoles} = useRoles()
  const {families, loading: loadingFamilies} = useFamilies()
  const {ministries, loading: loadingMinistries} = useMinistries()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const params = useParams()

  useEffect(() => {
    // Load member data
    const memberId = Number.parseInt(params.id as string)
    const member = memberRepository.getById(memberId).then((member) => {
      if (!member) {
        console.error("Membro não encontrado")
        return
      }

      setFormData({
        name: member.name,
        birthdate: member.birthdate?.toISOString().split("T")[0] || "",
        gender: member.gender,
        phone: member.phone,
        email: member.email || "",
        roleId: member.role.id.toString(),
        familyId: member.family?.id?.toString() || "",
        imageUrl: member.image_url || "",
        ministries: member.ministries?.map((m) => m.id || 0) || [],
      })
      setIsLoading(false)
    });
    
  }, [params.id])

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
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Updating member:", formData)
      window.location.href = `/members/${params.id}`
    } catch (error) {
      console.error("Error updating member:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Deleting member:", params.id)
      window.location.href = "/members"
    } catch (error) {
      console.error("Error deleting member:", error)
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
    window.location.href = `/members/${params.id}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados do membro...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Editar Membro</h1>
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
                        {roles.map((role) => (
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
                        {families.map((family) => (
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
                      {ministries.map((ministry) => (
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
                              Alterar Foto
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
                    {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                  </Button>

                  <Button variant="outline" onClick={goBack} className="w-full">
                    Cancelar
                  </Button>

                  <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Membro
                  </Button>
                </CardContent>
              </Card>

              {/* Member Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informações</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p>• Membro desde: Janeiro 2023</p>
                  <p>• Última atualização: Hoje</p>
                  <p>• Status: Ativo</p>
                  <p>• ID do membro: #{params.id}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-md mx-4">
                <CardHeader>
                  <CardTitle className="text-red-600">Confirmar Exclusão</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    Tem certeza que deseja excluir este membro? Esta ação não pode ser desfeita.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="destructive" onClick={handleDelete} className="flex-1">
                      Sim, Excluir
                    </Button>
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
