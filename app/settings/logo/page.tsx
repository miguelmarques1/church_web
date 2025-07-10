"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, Save, Trash2 } from "lucide-react"
import { Logo } from "@/components/layout/logo"
import Image from "next/image"

export default function LogoSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoImage, setLogoImage] = useState<string | null>(null)
  const [churchName, setChurchName] = useState("GERAÇÃO ELEITA")
  const [primaryColor, setPrimaryColor] = useState("#DC2626") // red-600

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simulate image upload
      const imageUrl = "/placeholder.svg?height=200&width=200"
      setLogoImage(imageUrl)
    }
  }

  const handleSave = () => {
    console.log("Saving logo settings:", { logoImage, churchName, primaryColor })
    // Here you would typically send to API
  }

  const goBack = () => {
    window.location.href = "/settings"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={goBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Configurações de Logo</h1>
        </div>

        <main className="p-4 pb-20 md:pb-4 max-w-2xl mx-auto">
          <div className="space-y-6">
            {/* Current Logo Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Logo Atual</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <Logo variant="dark" />
                  <p className="text-sm text-gray-500">Logo padrão do sistema</p>
                </div>
              </CardContent>
            </Card>

            {/* Upload New Logo */}
            <Card>
              <CardHeader>
                <CardTitle>Carregar Novo Logo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {logoImage ? (
                    <div className="relative flex flex-col items-center">
                      <Image
                        src={logoImage || "/placeholder.svg"}
                        alt="Logo Preview"
                        width={120}
                        height={120}
                        className="rounded-lg mb-4"
                      />
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setLogoImage(null)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Clique para fazer upload do logo da igreja</p>
                      <p className="text-xs text-gray-500 mb-4">
                        Recomendado: 512x512px, formato PNG com transparência
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Label htmlFor="logo-upload" className="cursor-pointer">
                        <Button variant="outline" asChild>
                          <span>Selecionar Imagem</span>
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="church-name">Nome da Igreja</Label>
                    <Input
                      id="church-name"
                      value={churchName}
                      onChange={(e) => setChurchName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="primary-color">Cor Principal</Label>
                    <div className="flex gap-3 mt-1">
                      <div className="w-10 h-10 rounded-md overflow-hidden">
                        <input
                          type="color"
                          id="primary-color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-12 h-12 -m-1 cursor-pointer"
                        />
                      </div>
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="uppercase"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Esta cor será usada em elementos de destaque no aplicativo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Visualização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      {logoImage ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <Image src={logoImage || "/placeholder.svg"} alt="Logo" width={32} height={32} />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full" style={{ backgroundColor: primaryColor }}>
                          <span className="flex items-center justify-center h-full text-white text-sm font-bold">
                            {churchName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="font-semibold">{churchName}</span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button className="w-full md:w-auto" style={{ backgroundColor: primaryColor }} onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
